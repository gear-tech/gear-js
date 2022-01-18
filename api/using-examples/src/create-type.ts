import { getWasmMetadata, parseHexTypes, getTypeStructure } from '@gear-js/api';
import dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';
dotenv.config();

function writeJSON(data: any, name: string) {
  !fs.existsSync(path.resolve('test-json')) && fs.mkdirSync('test-json');
  return new Promise((resolve, reject) => {
    data &&
      fs.writeFile(path.join('test-json', name), JSON.stringify(data), (err) => {
        err && console.error(err);
        resolve(0);
      });
  });
}

export const typeStructure = async () => {
  const metaBytes = fs.readFileSync(process.env.CREATE_TYPE_CONTRACT_META_PATH);
  const meta = await getWasmMetadata(metaBytes);
  const displayedTypes = parseHexTypes(meta.types);
  const initInputType = getTypeStructure(meta.init_input, displayedTypes);
  const initOutputType = getTypeStructure(meta.init_output, displayedTypes);
  const inputType = getTypeStructure(meta.handle_input, displayedTypes);
  const outputType = getTypeStructure(meta.handle_output, displayedTypes);
  await Promise.all([
    writeJSON(meta, 'meta.json'),
    writeJSON(initInputType, 'init_input.json'),
    writeJSON(initOutputType, 'init_output.json'),
    writeJSON(inputType, 'input.json'),
    writeJSON(outputType, 'output.json'),
  ]);
  return;
};

typeStructure().then(() => process.exit(0));
