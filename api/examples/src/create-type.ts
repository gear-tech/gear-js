import { getWasmMetadata, parseHexTypes, getTypeStructure, CreateType } from '@gear-js/api';
import dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';
dotenv.config();

function writeJSON(data: any, name: string) {
  !fs.existsSync(path.resolve('test-json')) && fs.mkdirSync('test-json');
  data &&
    fs.writeFile(path.join('test-json', name), JSON.stringify(data), (err) => {
      err && console.error(err);
    });
}

async function typeStructure() {
  const metaBytes = fs.readFileSync(process.env.CREATE_TYPE_CONTRACT_META_PATH);
  const meta = await getWasmMetadata(metaBytes);
  writeJSON(meta, 'meta.json');
  const displayedTypes = parseHexTypes(meta.types);
  console.log(displayedTypes);

  const initInputType = getTypeStructure(meta.init_input, displayedTypes);
  writeJSON(initInputType, 'init_input.json');
  const initOutputType = getTypeStructure(meta.init_output, displayedTypes);
  writeJSON(initOutputType, 'init_output.json');
  const inputType = getTypeStructure(meta.input, displayedTypes);
  writeJSON(inputType, 'input.json');
  const outputType = getTypeStructure(meta.output, displayedTypes);
  writeJSON(outputType, 'output.json');
}

typeStructure()
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    process.exit();
  });
