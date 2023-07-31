import http from 'http';

import config from './config';
import { logger } from './common';

export const statuses = {
  rmq: false,
  database: false,
  gear: false,
};

export const changeStatus = (service: 'rmq' | 'database' | 'gear', status?: boolean) => {
  statuses[service] = status === undefined ? !statuses[service] : status;
};

const getStatus = (service: 'rmq' | 'database' | 'gear' | 'all') => {
  if (service === 'all') {
    const connected = Object.values(statuses).reduce((prev, cur) => prev && cur);
    return { code: connected ? 200 : 500, connected };
  }
  return { code: statuses[service] ? 200 : 500, connected: statuses[service] };
};

const reqListener = function (req: http.IncomingMessage, res: http.ServerResponse) {
  let status = getStatus('all');

  switch (req.url) {
    case '/rmq':
      status = getStatus('rmq');
      break;
    case '/database':
      status = getStatus('database');
      break;
    case '/gear':
      status = getStatus('gear');
      break;
  }
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(status.code);
  res.end(JSON.stringify({ connected: status.connected }));
};

const server = http.createServer(reqListener);

export function runHealthcheckServer() {
  server.listen(config.healthcheck.port, () => {
    logger.info(`Healthcheck app is running on ${config.healthcheck.port} port`);
  });
}
