import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsNumber()
  targetPrice: number;

  @ApiProperty()
  @IsEmail()
  email: string;
}
