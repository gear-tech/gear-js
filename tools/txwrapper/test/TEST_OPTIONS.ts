import { getRegistryBase } from '@substrate/txwrapper-core';
import METADATA_HEX from './METADATA_HEX';

export default {
  metadataRpc: METADATA_HEX,
  registry: getRegistryBase({
    chainProperties: { ss58Format: 137, tokenDecimals: 12, tokenSymbol: 'VARA' },
    metadataRpc: METADATA_HEX,
    specTypes: {},
  }),
};
