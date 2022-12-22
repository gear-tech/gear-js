import { transformTypes } from '../utils';
import * as rpc from './rpc.json';
import * as typesMetadata from './types-metadata.json';
import * as typesProgram from './types-program.json';
import * as typesMessage from './types-message.json';
import * as typesDebug from './types-debug.json';

const gearRpc = transformTypes(rpc).rpc;
const gearTypes = {
  ...transformTypes(typesMetadata).types,
  ...transformTypes(typesProgram).types,
  ...transformTypes(typesMessage).types,
  ...transformTypes(typesDebug).types,
};
export { gearRpc, gearTypes };
