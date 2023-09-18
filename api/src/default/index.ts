import * as rpc from './rpc.json';
import * as typesCommon from './types-common.json';
import * as typesMessage from './types-message.json';
import * as typesMetadata from './types-metadata.json';
import * as typesProgram from './types-program.json';
import { transformTypes } from '../utils/types';

const gearRpc = transformTypes(rpc).rpc;
const gearTypes = {
  ...transformTypes(typesMetadata).types,
  ...transformTypes(typesProgram).types,
  ...transformTypes(typesMessage).types,
  ...transformTypes(typesCommon).types,
};
export { gearRpc, gearTypes };
