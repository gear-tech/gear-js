import { Request, Response, Router } from 'express';

export const healthcheckRouter = Router({});

const status = {
  kafka: false,
};

export const changeStatus = (service: 'kafka') => {
  status[service] = !status[service];
};

healthcheckRouter
  .get('/kafka', async (req: Request, res: Response) => {
    await res.status(status.kafka ? 200 : 500).json({ connected: status.kafka });
  })
  .get('', async (req: Request, res: Response) => {
    await res.status(status.kafka ? 200 : 500).json({ connected: status });
  });
