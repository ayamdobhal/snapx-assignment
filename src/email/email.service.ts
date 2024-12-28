import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('smtp.host'),
      port: this.configService.get('smtp.port'),
      secure: true,
      auth: {
        user: this.configService.get('smtp.user'),
        pass: this.configService.get('smtp.password'),
      },
    });
  }

  async sendPriceChangeAlert(
    token: string,
    priceChange: number,
    currentPrice: number,
  ) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('smtp.user'),
        to: this.configService.get('notificationEmail'),
        subject: `Price Alert: ${token} price changed by ${priceChange.toFixed(2)}%`,
        text: `The price of ${token} has changed by ${priceChange.toFixed(2)}% in the last hour. Current price: $${currentPrice}`,
      });
    } catch (error) {
      this.logger.error('Error sending price change alert:', error);
    }
  }

  async sendTargetPriceAlert(
    email: string,
    token: string,
    currentPrice: number,
  ) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('smtp.user'),
        to: email,
        subject: `Target Price Alert: ${token}`,
        text: `The price of ${token} has reached your target price. Current price: $${currentPrice}`,
      });
    } catch (error) {
      this.logger.error('Error sending target price alert:', error);
    }
  }
}
