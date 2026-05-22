import cors from '@fastify/cors';
import { createLogger } from '@gear-js/logger';
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';

import { config, networkConfigMap } from './config.js';

const logger = createLogger('server');

import {
  validateBlobHashes,
  validateCode,
  validateCodeId,
  validateDeadline,
  validateSender,
  validateSignature,
} from './field-validator.js';
import { createRequest, getStatus as getJobStatus } from './shared/db.js';
import type { RequestCodeValidationParams } from './shared/types.js';
import { generateJobId } from './util.js';

const FIELD_VALIDATORS: Record<keyof RequestCodeValidationParams, (data: unknown) => boolean> = {
  code: validateCode,
  codeId: validateCodeId,
  sender: validateSender,
  blobHashes: validateBlobHashes,
  deadline: validateDeadline,
  wvaraPermitSignature: validateSignature,
  requestCodeValidationSignature: validateSignature,
};

const REQUIRED_FIELDS = Object.keys(FIELD_VALIDATORS) as (keyof RequestCodeValidationParams)[];

const requestCodeValidationHandler =
  (enqueueForNetwork: (network: string, jobId: string) => void) =>
  async (
    request: FastifyRequest<{ Params: { network: string }; Body: RequestCodeValidationParams }>,
    reply: FastifyReply,
  ) => {
    const { network } = request.params;
    logger.info(
      { network, codeId: request.body?.codeId, sender: request.body?.sender },
      'Received request-code-validation',
    );

    const networkConfig = networkConfigMap.get(network);
    if (!networkConfig) {
      logger.warn({ network }, 'Unknown network');
      return reply.status(404).send({ error: `Unknown network: ${network}` });
    }

    const body = request.body;

    const missing = REQUIRED_FIELDS.filter((field) => body[field] === undefined || body[field] === null);
    if (missing.length > 0) {
      logger.warn({ network, missing }, 'Missing required fields');
      return reply.status(400).send({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    for (const field of REQUIRED_FIELDS) {
      if (!FIELD_VALIDATORS[field](body[field])) {
        logger.warn({ network, field }, 'Invalid field value');
        return reply.status(400).send({ error: `Invalid field: ${field}` });
      }
    }

    const jobId = generateJobId(network, body.codeId);
    logger.debug({ jobId, network, codeId: body.codeId }, 'Generated jobId');

    const existing = await getJobStatus(jobId);
    if (existing) {
      const isPermanentFailure = existing.status === 'failed' && !!existing.error;
      if (existing.status !== 'failed' || isPermanentFailure) {
        logger.info({ jobId, status: existing.status }, 'Duplicate request, returning existing job');
        return reply.send({ jobId, routerAddress: networkConfig.routerAddress });
      }
    }

    await createRequest(network, body);
    logger.info({ jobId, network, codeId: body.codeId }, 'Job created and enqueued');
    enqueueForNetwork(network, jobId);

    return reply.send({ jobId, routerAddress: networkConfig.routerAddress });
  };

const statusHandler = async (request: FastifyRequest<{ Querystring: { jobId: string } }>, reply: FastifyReply) => {
  const { jobId } = request.query;
  if (!jobId) {
    logger.warn('Status query missing jobId');
    return reply.status(400).send({ error: 'Missing jobId' });
  }

  logger.debug({ jobId }, 'Status query');
  const status = await getJobStatus(jobId);
  if (!status) {
    logger.warn({ jobId }, 'Status query: job not found');
    return reply.status(404).send({ error: 'Not found' });
  }

  logger.debug({ jobId, status: status.status }, 'Status query result');
  return reply.send(status);
};

export async function runServer(enqueueForNetwork: (network: string, jobId: string) => void) {
  const app = Fastify({ logger: true });

  await app.register(cors);

  app.post<{ Params: { network: string }; Body: RequestCodeValidationParams }>(
    '/:network/request-code-validation',
    requestCodeValidationHandler(enqueueForNetwork),
  );
  app.get<{ Querystring: { jobId: string } }>('/status', statusHandler);

  await app.listen({ port: config.port, host: '0.0.0.0' });

  return app;
}
