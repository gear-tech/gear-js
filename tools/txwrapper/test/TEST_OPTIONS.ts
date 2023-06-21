import { getRegistryBase } from '@substrate/txwrapper-core';
import METADATA_HEX from './METADATA_HEX';

export default {
  metadataRpc: METADATA_HEX,
  registry: getRegistryBase({
    chainProperties: { ss58Format: 42, tokenDecimals: 12, tokenSymbol: 'GR' },
    metadataRpc: METADATA_HEX,
    specTypes: {},
  }),
};
