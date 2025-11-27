import { HexString } from '@gear-js/api';

import { VFT_CODE_IDS } from './consts';

const isVftCode = (codeId: HexString) => VFT_CODE_IDS.includes(codeId);

export { isVftCode };
