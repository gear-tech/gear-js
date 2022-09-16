import { getWasmMetadata, CreateType, isJSON, toJSON, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';
import { readFileSync } from 'fs';

export const DEFAULT_TYPES = [
  'init_input',
  'init_output',
  'handle_input',
  'handle_output',
  'async_init_input',
  'async_init_output',
  'async_handle_input',
  'async_handle_output',
  'meta_state_input',
  'meta_state_output',
];

function getType(type, meta) {
  return DEFAULT_TYPES.includes(type) ? meta[type] : type;
}

/**
 *
 * @param {string} pathToMeta
 * @param {string} type
 * @param {string} payload
 */
export async function createType(payload, type, pathToMeta) {
  if (isJSON(payload)) {
    payload = toJSON(payload);
  }
  let meta;
  if (pathToMeta) {
    meta = await getWasmMetadata(readFileSync(pathToMeta));
  }
  type = getType(type, meta);
  return CreateType.create(type, payload, meta);
}

export async function getTypeStruct(type, pathToMeta) {
  const meta = await getWasmMetadata(readFileSync(pathToMeta));
  type = getType(type, meta);
  return { typeName: type, struct: createPayloadTypeStructure(type, decodeHexTypes(meta.types), true) };
}
