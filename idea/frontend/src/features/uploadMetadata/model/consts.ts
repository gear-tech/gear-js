import { ProgramMetadata } from '@gear-js/api';

const META_FIELDS: (keyof ProgramMetadata)[] = [
  'init_input',
  'init_output',
  'async_init_input',
  'async_init_output',
  'handle_input',
  'handle_output',
  'async_handle_input',
  'async_handle_output',
  'meta_state_input',
  'meta_state_output',
  'types',
];

export { META_FIELDS };
