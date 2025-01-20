const routes = {
  home: '/',
  codes: '/codes',
  code: '/code/:codeId',
  uploadCode: '/code/upload',
  programs: '/programs',
  program: ':programId',
  uploadProgram: 'upload',
  initializeProgram: ':codeId/initialize',
  message: '/messages/:messageId',
  mailbox: '/mailbox',
  explorer: '/explorer',
  state: '/state/:programId',
  sailsState: '/state/sails/:programId',
  send: '/send',
  sendMessage: 'message/:programId',
  reply: 'reply/:messageId',
  block: ':blockId',
  vouchers: '/vouchers',
  dns: '/dns',
  singleDns: ':address',
};

const absoluteRoutes = {
  program: `${routes.programs}/${routes.program}`,
  uploadProgram: `${routes.programs}/${routes.uploadProgram}`,
  initializeProgram: `${routes.codes}/${routes.initializeProgram}`,
  sendMessage: `${routes.send}/${routes.sendMessage}`,
  reply: `${routes.send}/${routes.reply}`,
  block: `${routes.explorer}/${routes.block}`,
  singleDns: `${routes.dns}/${routes.singleDns}`,
};

export { routes, absoluteRoutes };
