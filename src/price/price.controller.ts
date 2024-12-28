import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAlertDto } from './dto/create-alert.dto';
import { PriceService } from './price.service';

@ApiTags('price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('history')
  @ApiOperation({ summary: 'Get price history for a token' })
  async getPriceHistory(@Query('token') token: string) {
    return await this.priceService.getPriceHistory(token);
  }

  @Post('alert')
  @ApiOperation({ summary: 'Create price alert' })
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return await this.priceService.createAlert(createAlertDto);
  }

  @Get('swap-rate')
  @ApiOperation({ summary: 'Get ETH to BTC swap rate' })
  async getSwapRate(@Query('amount') amount: number) {
    return await this.priceService.getSwapRate(amount);
  }
}
