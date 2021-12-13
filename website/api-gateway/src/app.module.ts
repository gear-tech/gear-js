import { Module } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';

@Module({
  imports: [ApiGatewayModule],
})
export class AppModule {}
