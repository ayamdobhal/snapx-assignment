import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import Moralis from 'moralis';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Snapx Assignment')
    .setDescription('APIs for Snapx Assignment')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
