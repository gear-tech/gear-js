import { Request, Response, Router } from 'express';

export const healthcheckRouter = Router({});

const status = {
  kafka: false,
  database: false,
  ws: false,
};

export const changeStatus = (service: 'kafka' | 'ws' | 'database') => {
  status[service] = !status[service];
};

healthcheckRouter
  .get('/kafka', async (req: Request, res: Response) => {
    res.status(status.kafka ? 200 : 500).json({ connected: status.kafka });
  })
  .get('/database', async (req: Request, res: Response) => {
    res.status(status.database ? 200 : 500).json({ connected: status.database });
  })
  .get('/ws', (req: Request, res: Response) => {
    res.status(status.ws ? 200 : 500).json({ connected: status.ws });
  })
  .get('', (req: Request, res: Response) => {
    const { kafka, database, ws } = status;
    const allTogether = kafka && database && ws;
    res.status(allTogether ? 200 : 500).json({ connected: status });
  });
