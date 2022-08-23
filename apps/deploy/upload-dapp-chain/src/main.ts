import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app.module";
import { gearService } from "./gear/gear-service";
import { TgAccessAdminsGuard } from "./common/guards/tg-access-admins.guard";

async function bootstrap() {
  try {
    await gearService.connect();
    const app = await NestFactory.create(AppModule);

    const configService = app.get<ConfigService>(ConfigService);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalGuards(new TgAccessAdminsGuard());
    await app.listen(configService.get<number>("app.PORT"));
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
