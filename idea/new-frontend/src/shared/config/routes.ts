const routes = {
  home: '/',
  codes: '/codes',
  messages: '/messages',
  programs: '/programs',
  uploadProgram: '/upload-program',
  uploadedPrograms: '/uploaded-programs',
  editor: '/editor',
  mailbox: '/mailbox',
  examples: '/examples',
  explorer: '/explorer',
  termsOfUse: '/terms-of-use',
  privacyPolicy: '/privacy-policy',
  code: '/code/:codeId',
  program: '/program/:programId',
  message: '/message/:messageId',
  state: '/state/:programId',
  send: '/send',
  sendMessage: 'message/:programId',
  reply: 'reply/:messageId',
  meta: '/meta/:programId',
};

export { routes };
