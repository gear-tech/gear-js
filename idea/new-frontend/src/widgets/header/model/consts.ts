import { routes, absoluteRoutes } from 'shared/config';

const SHORT_HEADER_HEIGHT = '6.4375rem';
const FULL_HEADER_HEIGHT = '10.28125rem';

const CODE_MODAL_PROPS = {
  name: 'code',
  redirectTo: routes.uploadCode,
};

const PROGRAM_MODAL_PROPS = {
  name: 'program',
  redirectTo: absoluteRoutes.uploadProgram,
};

const PATHS_WITHOUT_BOTTOM_SIDE = [
  absoluteRoutes.code,
  absoluteRoutes.message,
  absoluteRoutes.meta,
  absoluteRoutes.program,
  absoluteRoutes.sendMessage,
  absoluteRoutes.reply,
  routes.state,
];

export { SHORT_HEADER_HEIGHT, FULL_HEADER_HEIGHT, CODE_MODAL_PROPS, PROGRAM_MODAL_PROPS, PATHS_WITHOUT_BOTTOM_SIDE };
