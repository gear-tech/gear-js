import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BlocksModule } from './blocks/blocks.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  console.log(`App succesfully run on the ${port} 🚀`);
  await app.listen(port);
}
bootstrap();
