import express, { Request, Response } from 'express';
import config from './config';

const status = {
  kafka: false,
  database: false,
  ws: false,
};

export const changeStatus = (service: 'kafka' | 'ws' | 'database') => {
  status[service] = !status[service];
};

const app = express();

app.get('/health/kafka', (req: Request, res: Response) => {
  res.status(status.kafka ? 200 : 500).json({ connected: status.kafka });
});
app.get('/health/database', (req: Request, res: Response) => {
  res.status(status.database ? 200 : 500).json({ connected: status.database });
});
app.get('/health/ws', (req: Request, res: Response) => {
  res.status(status.ws ? 200 : 500).json({ connected: status.ws });
});

app.listen(config.healthcheck.port);
