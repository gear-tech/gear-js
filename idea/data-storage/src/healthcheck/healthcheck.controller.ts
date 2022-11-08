import { Controller, Get, HttpCode } from '@nestjs/common';

const status = {
  kafka: false,
  database: false,
  gearWSProvider: false,
};

export const changeStatus = (service: 'kafka' | 'database' | 'gear') => {
  status[service] = !status[service];
};

@Controller('health')
export class HealthcheckController {
  constructor() {}

  @Get('kafka')
  @HttpCode(status.kafka ? 200 : 500)
  kafka() {
    return { connected: status.kafka };
  }

  @Get('database')
  @HttpCode(status.database ? 200 : 500)
  database() {
    return { connected: status.database };
  }

  @Get('gear_ws_provider')
  @HttpCode(status.gearWSProvider ? 200 : 500)
  gearWSProvider() {
    return { connected: status.gearWSProvider };
  }

  @Get()
  @HttpCode(status.gearWSProvider && status.database && status.kafka ? 200 : 500)
  general() {
    return { connected: { ...status } };
  }
}
