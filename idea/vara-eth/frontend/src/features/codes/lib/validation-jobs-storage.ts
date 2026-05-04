import { VALIDATION_JOB_STORAGE_KEY } from './consts';

export type ValidationJob = {
  jobId: string;
  codeId?: string;
};

const isValidationJob = (value: unknown): value is ValidationJob => {
  if (!value || typeof value !== 'object') return false;

  const job = value as Record<string, unknown>;

  return typeof job.jobId === 'string' && (job.codeId === undefined || typeof job.codeId === 'string');
};

export const getValidationJobs = (): ValidationJob[] => {
  const rawValue = localStorage.getItem(VALIDATION_JOB_STORAGE_KEY);

  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.filter(isValidationJob);
    }
  } catch {
    return [];
  }

  return [];
};

const setValidationJobs = (jobs: ValidationJob[]) => {
  if (!jobs.length) {
    localStorage.removeItem(VALIDATION_JOB_STORAGE_KEY);
    return;
  }

  localStorage.setItem(VALIDATION_JOB_STORAGE_KEY, JSON.stringify(jobs));
};

export const addValidationJob = (job: ValidationJob) => {
  const jobs = getValidationJobs();

  if (jobs.some(({ jobId }) => jobId === job.jobId)) {
    return;
  }

  setValidationJobs([job, ...jobs]);
};

export const removeValidationJob = (jobId: string) => {
  const jobs = getValidationJobs().filter((job) => job.jobId !== jobId);

  setValidationJobs(jobs);
};
