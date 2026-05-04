import { useEffect } from 'react';

import { useAddMyActivity } from '@/app/store';
import { TransactionTypes } from '@/app/store/my-activity';
import { CODE_VALIDATION_SERVICE_URL } from '@/shared/config';

import { POLL_INTERVAL_MS } from './consts';
import { getCodeValidationStatus } from './requests';
import { getValidationJobs, removeValidationJob } from './validation-jobs-storage';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useCodeValidationPolling = () => {
  const addMyActivity = useAddMyActivity();

  useEffect(() => {
    if (!CODE_VALIDATION_SERVICE_URL) {
      return;
    }

    let isCancelled = false;

    const poll = async () => {
      while (!isCancelled) {
        try {
          const jobs = getValidationJobs();

          if (!jobs.length) {
            await wait(POLL_INTERVAL_MS);
            continue;
          }

          for (const { jobId, codeId } of jobs) {
            try {
              const { status } = await getCodeValidationStatus(CODE_VALIDATION_SERVICE_URL, jobId);

              if (status !== 'success' && status !== 'failed') {
                continue;
              }

              removeValidationJob(jobId);

              if (codeId) {
                await addMyActivity({
                  type: TransactionTypes.codeValidation,
                  codeId,
                  resultStatus: status === 'success' ? 'success' : 'error',
                  error: status === 'success' ? undefined : 'validation error',
                });
              }
            } catch (error) {
              console.error('Code validation polling job failed:', { jobId, error });
            }
          }
        } catch (error) {
          console.error('Code validation polling iteration failed:', error);
        }

        if (!isCancelled) {
          await wait(POLL_INTERVAL_MS);
        }
      }
    };

    void poll();

    return () => {
      isCancelled = true;
    };
  }, [addMyActivity]);
};
