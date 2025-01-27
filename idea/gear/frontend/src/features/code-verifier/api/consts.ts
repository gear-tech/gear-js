const API_URL = import.meta.env.VITE_CODE_VERIFIER_API_URL as string;

const METHOD = {
  VERIFY: 'verify',
  VERIFY_STATUS: 'verify/status',
  CODE: 'code',
} as const;

export { API_URL, METHOD };
