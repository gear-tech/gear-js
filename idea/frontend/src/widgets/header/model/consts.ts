import { routes, absoluteRoutes } from '@/shared/config';

const SHORT_HEADER_HEIGHT = '6.4375rem';
const FULL_HEADER_HEIGHT = '10.28125rem';

const PATHS_WITHOUT_BOTTOM_SIDE = [
  absoluteRoutes.program,
  absoluteRoutes.sendMessage,
  absoluteRoutes.reply,
  absoluteRoutes.initializeProgram,
  routes.state,
  routes.code,
  '/state/full/:programId',
  '/state/wasm/:programId',
];

export { SHORT_HEADER_HEIGHT, FULL_HEADER_HEIGHT, PATHS_WITHOUT_BOTTOM_SIDE };
