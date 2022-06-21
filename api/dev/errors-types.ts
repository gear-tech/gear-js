const { readFileSync, writeFileSync } = require('fs');
const { getTypesFromTypeDef, isJSON } = require('../src');

const ERRORS_REGESTRY = './src/default/errors-registry';
const ERRORS_TYPES = './src/default/types-errors.json';

const main = async () => {
  const regestry = '0x' + readFileSync(ERRORS_REGESTRY).toString();
  const { typesFromTypeDef } = getTypesFromTypeDef(regestry, undefined, false);
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
