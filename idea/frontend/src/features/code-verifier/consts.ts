const VERIFY_ROUTES = {
  MAIN: '/verify',
  REQUEST: ':codeId?',
  REQUEST_STATUS: 'status/:id',
} as const;

export { VERIFY_ROUTES };
