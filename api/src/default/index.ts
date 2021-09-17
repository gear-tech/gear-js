import { transformTypes } from '../utils';
import * as rpc from './rpc.json';
import * as types from './types.json';

const gearRpc = transformTypes(rpc).rpc;
const gearTypes = transformTypes(types).types;

export { gearRpc, gearTypes };
