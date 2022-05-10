import express, { Request, Response } from 'express';
import config from './config';

const status = {
  kafka: false,
  ws: false,
};

export const changeStatus = (service: 'kafka' | 'ws') => {
  status[service] = !status[service];
};

const app = express();

app.get('/health/kafka', (req: Request, res: Response) => {
  res.status(status.kafka ? 200 : 500).json({ connected: status.kafka });
});

app.get('/health/ws', (req: Request, res: Response) => {
  res.status(status.ws ? 200 : 500).json({ connected: status.ws });
});

app.get('/health', (req: Request, res: Response) => {
  const { kafka, ws } = status;
  const allTogether = kafka && ws;
  res.status(allTogether ? 200 : 500).json({ connected: status });
});

app.listen(config.healthcheck.port, () => {
  console.log(`Healthckech server is running on port ${config.healthcheck.port} 🚀`);
});
