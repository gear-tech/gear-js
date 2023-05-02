import { Request, Response, Router } from 'express';

export const healthcheckRouter = Router({});

const status = {
  rabbitMQ: false,
  database: false,
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
  .get('', (req: Request, res: Response) => {
    const { rabbitMQ, database } = status;
    const allTogether = rabbitMQ && database;
    res.status(allTogether ? 200 : 500).json({ connected: status });
  });
