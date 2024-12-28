import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import Moralis from 'moralis';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { EmailService } from '../email/email.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { Alert } from './entities/alert.entity';
import { Price } from './entities/price.entity';
import { get24HourlyPrices } from './helpers/hourly-prices';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchPrices() {
    try {
      const tokens = ['ethereum', 'polygon'];

      for (const token of tokens) {
        const response = await Moralis.EvmApi.token.getTokenPrice({
          address:
            token === 'ethereum'
              ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
              : '0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6',
        });

        const price = new Price();
        price.token = token;
        price.price = response.raw.usdPrice;
        await this.priceRepository.save(price);

        await this.checkPriceChange(token);
        await this.checkAlerts(token, price.price);
      }
    } catch (error) {
      this.logger.error('Error fetching prices:', error);
    }
  }

  private async checkPriceChange(token: string) {
    const hourAgo = new Date();
    hourAgo.setHours(hourAgo.getHours() - 1);

    const [oldPrice, currentPrice] = await Promise.all([
      this.priceRepository.findOne({
        where: { token, timestamp: LessThan(hourAgo) },
        order: { timestamp: 'DESC' },
      }),
      this.priceRepository.findOne({
        where: { token },
        order: { timestamp: 'DESC' },
      }),
    ]);

    if (oldPrice && currentPrice) {
      const priceChange =
        ((currentPrice.price - oldPrice.price) / oldPrice.price) * 100;

      if (priceChange > 3) {
        await this.emailService.sendPriceChangeAlert(
          token,
          priceChange,
          currentPrice.price,
        );
      }
    }
  }

  private async checkAlerts(token: string, currentPrice: number) {
    const alerts = await this.alertRepository.find({
      where: { token, triggered: false },
    });

    for (const alert of alerts) {
      if (currentPrice >= alert.targetPrice) {
        await this.emailService.sendTargetPriceAlert(
          alert.email,
          token,
          currentPrice,
        );
        alert.triggered = true;
        await this.alertRepository.save(alert);
      }
    }
  }

  async getPriceHistory(token: string) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const data = await this.priceRepository.find({
      where: { token, timestamp: MoreThanOrEqual(yesterday) },
      order: { timestamp: 'DESC' },
    });

    return get24HourlyPrices(data);
  }

  async createAlert(createAlertDto: CreateAlertDto) {
    const alert = this.alertRepository.create(createAlertDto);
    return await this.alertRepository.save(alert);
  }

  async getSwapRate(ethAmount: number) {
    try {
      const ethPrice = await Moralis.EvmApi.token.getTokenPrice({
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      });

      const btcPrice = await Moralis.EvmApi.token.getTokenPrice({
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      });

      const ethValue = ethAmount * ethPrice.raw.usdPrice;
      const btcAmount = ethValue / btcPrice.raw.usdPrice;
      const fee = ethAmount * 0.003;
      const feeInUsd = fee * ethPrice.raw.usdPrice;

      return {
        btcAmount,
        fee,
        feeInUsd,
      };
    } catch (error) {
      this.logger.error('Error calculating swap rate:', error);
      throw error;
    }
  }
}
