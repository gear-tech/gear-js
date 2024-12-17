import { isHex } from '@polkadot/util';
import { z } from 'zod';

import { GENESIS } from '@/shared/config';

const FIELD_NAME = {
  DOCKER_IMAGE_VERSION: 'version',
  CODE_ID: 'codeId',
  REPO_LINK: 'repoLink',
  PROJECT_ID_TYPE: 'projectIdType',
  PROJECT_ID: 'projectId',
  NETWORK: 'network',
  BUILD_IDL: 'buildIdl',
} as const;

const NETWORK = {
  [GENESIS.MAINNET]: 'vara_mainnet',
  [GENESIS.TESTNET]: 'vara_testnet',
} as const;

const NETWORK_OPTIONS = [
  { label: 'Mainnet', value: NETWORK[GENESIS.MAINNET] },
  { label: 'Testnet', value: NETWORK[GENESIS.TESTNET] },
] as const;

const PROJECT_ID_TYPE = {
  NAME: 'name',
  CARGO_TOML_PATH: 'cargoTomlPath',
} as const;

const DEFAULT_VALUES = {
  [FIELD_NAME.DOCKER_IMAGE_VERSION]: '',
  [FIELD_NAME.CODE_ID]: '',
  [FIELD_NAME.REPO_LINK]: '',
  [FIELD_NAME.PROJECT_ID_TYPE]: PROJECT_ID_TYPE.NAME as typeof PROJECT_ID_TYPE[keyof typeof PROJECT_ID_TYPE],
  [FIELD_NAME.PROJECT_ID]: '',
  [FIELD_NAME.NETWORK]: NETWORK_OPTIONS[0].value as typeof NETWORK[keyof typeof NETWORK],
  [FIELD_NAME.BUILD_IDL]: false,
};

const SCHEMA = z.object({
  [FIELD_NAME.DOCKER_IMAGE_VERSION]: z.string(),

  [FIELD_NAME.CODE_ID]: z // TODO: is there any case to validate that code hash is existing in the CURRENT network?
    .string()
    .trim()
    .refine((value) => isHex(value), { message: 'Value should be hex' }),

  [FIELD_NAME.REPO_LINK]: z.string().trim(), // TODO: url validation
  [FIELD_NAME.PROJECT_ID_TYPE]: z.string(),
  [FIELD_NAME.PROJECT_ID]: z.string().trim(), // TODO: name/path validation
  [FIELD_NAME.NETWORK]: z.string(),
  [FIELD_NAME.BUILD_IDL]: z.boolean(),
});

export { DEFAULT_VALUES, SCHEMA, NETWORK, FIELD_NAME, PROJECT_ID_TYPE, NETWORK_OPTIONS };
