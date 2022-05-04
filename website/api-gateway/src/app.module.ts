import { Module } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';

@Module({
  imports: [HealthcheckModule, ApiGatewayModule],
})
export class AppModule {}
