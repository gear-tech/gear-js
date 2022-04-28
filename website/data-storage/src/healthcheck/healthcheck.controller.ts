import { Controller, Get } from '@nestjs/common';

const status = {
  connectedToKafka: false,
  connectedToDatabse: false,
};

export const changeStatus = (service: 'kafka' | 'database') => {
  if (service === 'kafka') status.connectedToKafka = true;
  else if (service === 'database') status.connectedToDatabse = true;
};

@Controller('healthcheck')
export class HealthcheckController {
  constructor() {}

  @Get()
  async check() {
    return status;
  }
}
