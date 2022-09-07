import { routes, absoluteRoutes } from 'shared/config';

const CODE_MODAL_PROPS = {
  name: 'code',
  redirectTo: routes.uploadCode,
};

const PROGRAM_MODAL_PROPS = {
  name: 'program',
  redirectTo: routes.uploadProgram,
};

const PATHS_WITHOUT_BOTTOM_SIDE = [
  absoluteRoutes.code,
  absoluteRoutes.message,
  absoluteRoutes.meta,
  absoluteRoutes.program,
];

export { CODE_MODAL_PROPS, PROGRAM_MODAL_PROPS, PATHS_WITHOUT_BOTTOM_SIDE };
