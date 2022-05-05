import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

const status = {
  kafka: false,
};

export const changeStatus = (service: 'kafka') => {
  status[service] = !status[service];
};

@Controller('health')
export class HealthcheckController {
  constructor() {}

  @Get('kafka')
  kafka(@Res() response: Response) {
    return response.status(status.kafka ? 200 : 500).json({ connected: status.kafka });
  }

  @Get()
  general(@Res() response: Response) {
    return response.status(status.kafka ? 200 : 500).json({ connected: status });
  }
}
