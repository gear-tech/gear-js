const routes = {
  home: '/',
  codes: '/codes',
  programs: '/programs',
  messages: '/messages',
  uploadCode: '/upload-code',
  uploadProgram: '/upload-program',
  uploadedPrograms: '/uploaded-programs',
  editor: '/editor',
  mailbox: '/mailbox',
  examples: '/examples',
  explorer: '/explorer',
  termsOfUse: '/terms-of-use',
  privacyPolicy: '/privacy-policy',
  code: '/code/:codeId',
  state: '/state/:programId',
  program: '/program/:programId',
  message: '/message/:messageId',
  send: '/send',
  sendMessage: 'message/:programId',
  reply: 'reply/:messageId',
  meta: '/meta/:programId',
};

const absoluteRoutes = {
  code: `${routes.codes}/:codeId`,
  meta: `/meta/:programId`,
  program: `${routes.programs}/:programId`,
  message: `${routes.messages}/:messageId`,
};

export { routes, absoluteRoutes };
