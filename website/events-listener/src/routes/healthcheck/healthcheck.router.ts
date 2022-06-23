import express, { Request, Response, Router } from 'express';

const status = {
  kafka: false,
  ws: false,
};

export const changeStatus = (service: 'kafka' | 'ws') => {
  status[service] = !status[service];
};

export const healthcheckRouter = Router({});

healthcheckRouter
  .get('/kafka', (req: Request, res: Response) => {
    res.status(status.kafka ? 200 : 500).json({ connected: status.kafka });
  })
  .get('/ws', (req: Request, res: Response) => {
    res.status(status.ws ? 200 : 500).json({ connected: status.ws });
  })
  .get('', (req: Request, res: Response) => {
    const { kafka, ws } = status;
    const allTogether = kafka && ws;
    res.status(allTogether ? 200 : 500).json({ connected: status });
  });
