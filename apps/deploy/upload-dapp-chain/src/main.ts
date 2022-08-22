import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app.module";
import { gearService } from "./gear/gear-service";
import { TgAccessAccountsGuard } from "./common/guards/tg-access-accounts.guard";

async function bootstrap() {
  try {
    await gearService.connect();
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalGuards(new TgAccessAccountsGuard());
    await app.listen(configService.get<number>("app.PORT"));
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
