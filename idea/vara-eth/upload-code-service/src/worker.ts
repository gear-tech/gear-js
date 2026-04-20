import type { SQSBatchResponse, SQSHandler } from 'aws-lambda';
import { hexToBytes } from 'viem';

import { requestCodeValidation } from './eth.js';
import { getRequest, setStatus } from './shared/db.js';

export const handler: SQSHandler = async (event): Promise<SQSBatchResponse> => {
  const batchItemFailures: SQSBatchResponse['batchItemFailures'] = [];

  for (const record of event.Records) {
    let jobId: string | undefined;

    try {
      ({ jobId } = JSON.parse(record.body) as { jobId: string });
      if (!jobId) throw new Error('Missing jobId');

      console.log({ jobId }, 'Processing job');
      await setStatus(jobId, 'processing');

      const job = await getRequest(jobId);
      if (!job) {
        console.error(`Job not found: ${jobId}`);
        batchItemFailures.push({ itemIdentifier: record.messageId });
        continue;
      }

      console.log({ jobId, codeId: job.codeId }, 'Fetched job, submitting transaction');

      const result = await requestCodeValidation(hexToBytes(job.code), job.codeId);
      console.log({ jobId, status: result.status, transactionHash: result.transactionHash }, 'Transaction complete');

      await setStatus(jobId, result.status === 'success' ? 'success' : 'failed', result.transactionHash);
    } catch (error) {
      console.error({ jobId, messageId: record.messageId, error }, 'Failed to process task');
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};
