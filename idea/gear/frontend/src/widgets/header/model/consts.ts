import { VERIFY_ROUTES } from '@/features/code-verifier';
import { routes, absoluteRoutes } from '@/shared/config';

const SHORT_HEADER_HEIGHT = '6.4375rem';
const FULL_HEADER_HEIGHT = '10.28125rem';

const PATHS_WITHOUT_BOTTOM_SIDE = [
  absoluteRoutes.program,
  absoluteRoutes.sendMessage,
  absoluteRoutes.reply,
  absoluteRoutes.initializeProgram,
  absoluteRoutes.singleDns,
  routes.state,
  routes.code,
  routes.state,
  routes.sailsState,
  VERIFY_ROUTES.CODE,
  VERIFY_ROUTES.STATUS,
];

export { SHORT_HEADER_HEIGHT, FULL_HEADER_HEIGHT, PATHS_WITHOUT_BOTTOM_SIDE };
