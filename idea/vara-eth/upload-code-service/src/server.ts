import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';

import { config, networkConfigMap } from './config.js';
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
    const networkConfig = networkConfigMap.get(network);
    if (!networkConfig) {
      return reply.status(404).send({ error: `Unknown network: ${network}` });
    }

    const body = request.body;

    const missing = REQUIRED_FIELDS.filter((field) => body[field] === undefined || body[field] === null);
    if (missing.length > 0) {
      return reply.status(400).send({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    for (const field of REQUIRED_FIELDS) {
      if (!FIELD_VALIDATORS[field](body[field])) {
        return reply.status(400).send({ error: `Invalid field: ${field}` });
      }
    }

    const jobId = generateJobId(network, body.codeId);
    const existing = await getJobStatus(jobId);
    if (existing && existing.status !== 'failed') {
      return reply.send({ jobId, routerAddress: networkConfig.routerAddress });
    }

    await createRequest(network, body);
    enqueueForNetwork(network, jobId);

    return reply.send({ jobId, routerAddress: networkConfig.routerAddress });
  };

const statusHandler = async (request: FastifyRequest<{ Querystring: { jobId: string } }>, reply: FastifyReply) => {
  const { jobId } = request.query;
  if (!jobId) {
    return reply.status(400).send({ error: 'Missing jobId' });
  }

  const status = await getJobStatus(jobId);
  if (!status) {
    return reply.status(404).send({ error: 'Not found' });
  }

  return reply.send(status);
};

export async function runServer(enqueueForNetwork: (network: string, jobId: string) => void) {
  const app = Fastify({ logger: true });

  app.post<{ Params: { network: string }; Body: RequestCodeValidationParams }>(
    '/:network/request-code-validation',
    requestCodeValidationHandler(enqueueForNetwork),
  );
  app.get<{ Querystring: { jobId: string } }>('/status', statusHandler);

  await app.listen({ port: config.port, host: '0.0.0.0' });

  return app;
}
