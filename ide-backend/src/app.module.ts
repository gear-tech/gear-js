import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { configuration } from './config/configuration';
import { WasmBuildGateway } from './wasm-build.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [AppService, WasmBuildGateway],
})
export class AppModule {}
