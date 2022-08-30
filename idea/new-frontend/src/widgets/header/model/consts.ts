import { getAnimationTimeout } from 'shared/helpers';
import { routes } from 'shared/config';

const BLOCK_ANIMATION_TIMEOUT = getAnimationTimeout(15);

const CODE_MODAL_PROPS = {
  name: 'code',
  redirectTo: routes.uploadCode,
};

const PROGRAM_MODAL_PROPS = {
  name: 'program',
  redirectTo: routes.uploadProgram,
};

export { CODE_MODAL_PROPS, PROGRAM_MODAL_PROPS, BLOCK_ANIMATION_TIMEOUT };
