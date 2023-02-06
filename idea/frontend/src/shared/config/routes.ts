const routes = {
  home: '/',
  codes: '/codes',
  code: '/code/:codeId',
  uploadCode: '/upload-code',
  programs: '/programs',
  program: ':programId',
  uploadProgram: 'upload',
  initializeProgram: ':codeId/initialize',
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
  block: ':blockId',
};

const absoluteRoutes = {
  meta: `/meta/:programId`,
  program: `${routes.programs}/${routes.program}`,
  uploadProgram: `${routes.programs}/${routes.uploadProgram}`,
  initializeProgram: `${routes.codes}/${routes.initializeProgram}`,
  message: `${routes.messages}/${routes.message}`,
  sendMessage: `${routes.send}/${routes.sendMessage}`,
  reply: `${routes.send}/${routes.reply}`,
  block: `${routes.explorer}/${routes.block}`,
};

export { routes, absoluteRoutes };
