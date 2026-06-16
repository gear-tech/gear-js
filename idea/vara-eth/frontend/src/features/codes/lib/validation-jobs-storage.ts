import { VALIDATION_JOB_STORAGE_KEY } from './consts';

export type ValidationJob = {
  jobId: string;
  codeId?: string;
};

const getValidationJobsStorageKey = (ethChainId: number) => `${VALIDATION_JOB_STORAGE_KEY}:${ethChainId}`;

const isValidationJob = (value: unknown): value is ValidationJob => {
  if (!value || typeof value !== 'object') return false;

  const job = value as Record<string, unknown>;

  return typeof job.jobId === 'string' && (job.codeId === undefined || typeof job.codeId === 'string');
};

export const getValidationJobs = (ethChainId: number): ValidationJob[] => {
  const rawValue = localStorage.getItem(getValidationJobsStorageKey(ethChainId));

  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);

    if (Array.isArray(parsed)) {
      return parsed.filter(isValidationJob);
    }
  } catch {
    return [];
  }

  return [];
};

const setValidationJobs = (ethChainId: number, jobs: ValidationJob[]) => {
  const storageKey = getValidationJobsStorageKey(ethChainId);

  if (!jobs.length) {
    localStorage.removeItem(storageKey);
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(jobs));
};

export const addValidationJob = (ethChainId: number, job: ValidationJob) => {
  const jobs = getValidationJobs(ethChainId);

  if (jobs.some(({ jobId }) => jobId === job.jobId)) {
    return;
  }

  setValidationJobs(ethChainId, [job, ...jobs]);
};

export const removeValidationJob = (ethChainId: number, jobId: string) => {
  const jobs = getValidationJobs(ethChainId).filter((job) => job.jobId !== jobId);

  setValidationJobs(ethChainId, jobs);
};

export const hasPendingValidationJobByCodeId = (ethChainId: number, codeId: string) =>
  getValidationJobs(ethChainId).some((job) => job.codeId?.toLowerCase() === codeId.toLowerCase());
