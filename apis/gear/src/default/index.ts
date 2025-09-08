import * as rpc from './rpc.json';
import * as types from './types.json';
import { transformTypes } from '../utils/types';

const gearRpc = transformTypes(rpc).rpc;
const gearTypes = {
  ...transformTypes(types).types,
};
export { gearRpc, gearTypes };
