import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('IdeMicroservice');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get('server.port');
  logger.log(`App succesfully run on the ${port} 🚀`);
  await app.listen(port);
}
bootstrap();
