import { PROGRAM_TAB_ID } from '@/features/program/consts';

const routes = {
  home: '/',
  codes: '/codes',
  code: '/code/:codeId',
  uploadCode: '/code/upload',
  programs: '/programs',
  program: ':programId',
  programEventsTab: PROGRAM_TAB_ID.EVENTS,
  programVouchersTab: PROGRAM_TAB_ID.VOUCHERS,
  programMetadataTab: PROGRAM_TAB_ID.METADATA,
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
  programTabs: `${routes.programs}/${routes.program}/:tabId`,
  uploadProgram: `${routes.programs}/${routes.uploadProgram}`,
  initializeProgram: `${routes.codes}/${routes.initializeProgram}`,
  sendMessage: `${routes.send}/${routes.sendMessage}`,
  reply: `${routes.send}/${routes.reply}`,
  block: `${routes.explorer}/${routes.block}`,
  singleDns: `${routes.dns}/${routes.singleDns}`,
};

export { routes, absoluteRoutes };
