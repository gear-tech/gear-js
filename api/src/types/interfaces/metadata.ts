import { Hex } from '../common';

export interface Metadata {
  init_input?: string;
  init_output?: string;
  async_init_input?: string;
  async_init_output?: string;
  handle_input?: string;
  handle_output?: string;
  async_handle_input?: string;
  async_handle_output?: string;
  title?: string;
  types?: Hex;
  meta_state_input?: string;
  meta_state_output?: string;
}
