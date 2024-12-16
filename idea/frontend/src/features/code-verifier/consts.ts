const CODE_VERIFIER_ROUTES = {
  MAIN: '/verify',
  REQUEST: ':codeId?',
  REQUEST_STATUS: 'status/:id',
} as const;

export { CODE_VERIFIER_ROUTES };
