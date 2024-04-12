const routes = {
  home: '/',
  codes: '/codes',
  code: '/code/:codeId',
  uploadCode: '/code/upload',
  programs: '/programs',
  program: ':programId',
  uploadProgram: 'upload',
  initializeProgram: ':codeId/initialize',
  messages: '/messages',
  message: ':messageId',
  mailbox: '/mailbox',
  explorer: '/explorer',
  state: '/state/:programId',
  send: '/send',
  sendMessage: 'message/:programId',
  reply: 'reply/:messageId',
  block: ':blockId',
  vouchers: '/vouchers',
};

const absoluteRoutes = {
  program: `${routes.programs}/${routes.program}`,
  uploadProgram: `${routes.programs}/${routes.uploadProgram}`,
  initializeProgram: `${routes.codes}/${routes.initializeProgram}`,
  message: `${routes.messages}/${routes.message}`,
  sendMessage: `${routes.send}/${routes.sendMessage}`,
  reply: `${routes.send}/${routes.reply}`,
  block: `${routes.explorer}/${routes.block}`,
};

export { routes, absoluteRoutes };
