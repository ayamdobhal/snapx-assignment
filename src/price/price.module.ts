import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { Alert } from './entities/alert.entity';
import { Price } from './entities/price.entity';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

@Module({
  imports: [TypeOrmModule.forFeature([Price, Alert]), EmailModule],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
