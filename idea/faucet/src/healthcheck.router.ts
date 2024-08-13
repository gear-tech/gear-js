import { Request, Response, Router } from 'express';

export const healthcheckRouter = Router({});

const status = {
  database: false,
  ws: false,
};

export const changeStatus = (service: 'ws' | 'database'): boolean => {
  status[service] = !status[service];
  return status[service];
};

healthcheckRouter
  .get('/database', async (req: Request, res: Response) => {
    res.status(status.database ? 200 : 500).json({ connected: status.database });
  })
  .get('/ws', (req: Request, res: Response) => {
    res.status(status.ws ? 200 : 500).json({ connected: status.ws });
  })
  .get('', (req: Request, res: Response) => {
    const { database, ws } = status;
    const allTogether = database && ws;
    res.status(allTogether ? 200 : 500).json({ connected: status });
  });
