import { routes } from 'shared/config';

const CODE_MODAL_PROPS = {
  name: 'code',
  redirectTo: routes.uploadCode,
};

const PROGRAM_MODAL_PROPS = {
  name: 'program',
  redirectTo: routes.uploadProgram,
};

export { CODE_MODAL_PROPS, PROGRAM_MODAL_PROPS };
