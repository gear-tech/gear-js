import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

const status = {
  kafka: false,
  database: false,
};

export const changeStatus = (service: 'kafka' | 'database') => {
  status[service] = !status[service];
};

@Controller('health')
export class HealthcheckController {
  constructor() {}

  @Get('kafka')
  kafka(@Res() response: Response) {
    return response.status(status.kafka ? 200 : 500).json({ connected: status.kafka });
  }

  @Get('database')
  database(@Res() response: Response) {
    return response.status(status.database ? 200 : 500).json({ connected: status.database });
  }

  @Get()
  general(@Res() response: Response) {
    const { kafka, database } = status;
    const allTogether = kafka && database;
    return response.status(allTogether ? 200 : 500).json({ connected: { kafka, database } });
  }
}
