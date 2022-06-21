import { transformTypes } from '../utils';
import * as rpc from './rpc.json';
import * as typesProgram from './types-program.json';
import * as typesMessage from './types-message.json';
import * as typesDebug from './types-debug.json';
import * as typesErrors from './types-errors.json';

const gearRpc = transformTypes(rpc).rpc;
const gearTypes = {
  ...transformTypes(typesErrors).types,
  ...transformTypes(typesProgram).types,
  ...transformTypes(typesMessage).types,
  ...transformTypes(typesDebug).types,
};
export { gearRpc, gearTypes };
