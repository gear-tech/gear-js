const routes = {
  home: '/',
  codes: '/codes',
  code: ':codeId',
  uploadCode: '/upload-code',
  programs: '/programs',
  program: ':programId',
  uploadProgram: 'upload',
  messages: '/messages',
  message: ':messageId',
  editor: '/editor',
  mailbox: '/mailbox',
  examples: '/examples',
  explorer: '/explorer',
  termsOfUse: '/terms-of-use',
  privacyPolicy: '/privacy-policy',
  state: '/state/:programId',
  send: '/send',
  sendMessage: 'message/:programId',
  reply: 'reply/:messageId',
  meta: '/meta/:programId',
};

const absoluteRoutes = {
  code: `${routes.codes}/:codeId`,
  meta: `/meta/:programId`,
  program: `${routes.programs}/${routes.program}`,
  uploadProgram: `${routes.programs}/${routes.uploadProgram}`,
  message: `${routes.messages}/${routes.message}`,
};

export { routes, absoluteRoutes };
