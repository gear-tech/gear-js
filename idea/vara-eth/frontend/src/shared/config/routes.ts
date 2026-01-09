const routes = {
  home: '/',
  programs: '/programs',
  program: '/programs/:programId',
  codes: '/codes',
  code: '/codes/:codeId',

  message: {
    requests: '/messages/requests/:messageId',
    sent: '/messages/sent/:messageId',
  },

  user: '/user/:userId',
  notFound: '/404',
};

export { routes };
