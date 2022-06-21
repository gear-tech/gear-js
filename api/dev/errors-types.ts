import { readFileSync, writeFileSync } from 'fs';
import { getTypesFromTypeDef, Hex, isJSON } from '../src';

const ERRORS_REGESTRY = './src/default/errors-registry';
const GEAR_ERRORS_REGESTRY = './dev/error_registry/registry';
const ERRORS_TYPES = './src/default/types-errors.json';

const main = async () => {
  const registry = ('0x' + readFileSync(GEAR_ERRORS_REGESTRY).toString()) as Hex;
  writeFileSync(ERRORS_REGESTRY, registry.slice(2));
  const { typesFromTypeDef } = getTypesFromTypeDef(registry, undefined, false);
  for (let type of Object.keys(typesFromTypeDef)) {
    if (isJSON(typesFromTypeDef[type])) {
      typesFromTypeDef[type] = JSON.parse(typesFromTypeDef[type]);
    }
  }

  writeFileSync(ERRORS_TYPES, JSON.stringify({ types: typesFromTypeDef }));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
