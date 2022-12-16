import { Request, Response, Router } from 'express';

export const healthcheckRouter = Router({});

const status = {
  rabbitMQ: false,
  database: false,
  ws: false,
};

export const changeStatus = (service: 'rabbitMQ' | 'ws' | 'database') => {
  status[service] = !status[service];
};

healthcheckRouter
  .get('/rabbitMQ', async (req: Request, res: Response) => {
    res.status(status.rabbitMQ ? 200 : 500).json({ connected: status.rabbitMQ });
  })
  .get('/database', async (req: Request, res: Response) => {
    res.status(status.database ? 200 : 500).json({ connected: status.database });
  })
  .get('/ws', (req: Request, res: Response) => {
    res.status(status.ws ? 200 : 500).json({ connected: status.ws });
  })
  .get('', (req: Request, res: Response) => {
    const { rabbitMQ, database, ws } = status;
    const allTogether = rabbitMQ && database && ws;
    res.status(allTogether ? 200 : 500).json({ connected: status });
  });
