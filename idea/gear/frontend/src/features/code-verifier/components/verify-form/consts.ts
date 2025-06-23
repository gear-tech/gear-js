import { z } from 'zod';

import { GENESIS } from '@/shared/config';

import { isCodeIdValid } from '../../utils';

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
  [FIELD_NAME.PROJECT_ID_TYPE]: PROJECT_ID_TYPE.NAME as (typeof PROJECT_ID_TYPE)[keyof typeof PROJECT_ID_TYPE],
  [FIELD_NAME.PROJECT_ID]: '',
  [FIELD_NAME.NETWORK]: NETWORK_OPTIONS[0].value as (typeof NETWORK)[keyof typeof NETWORK],
  [FIELD_NAME.BUILD_IDL]: false,
};

const GITHUB_REPO_URL_REGEX = /^https?:\/\/(www\.)?github\.com\/([\w-]+)\/([\w-]+)(\/.*)?$/;
const CARGO_TOML_PATH_REGEX = /^(?:\.\/)?(?:[^/]+\/)*Cargo\.toml$/;

const SCHEMA = z
  .object({
    [FIELD_NAME.DOCKER_IMAGE_VERSION]: z.string(),

    [FIELD_NAME.CODE_ID]: z
      .string()
      .trim()
      .refine((value) => isCodeIdValid(value), { message: 'Invalid hex' }),

    [FIELD_NAME.REPO_LINK]: z
      .string()
      .trim()
      .refine((value) => GITHUB_REPO_URL_REGEX.test(value), { message: 'Invalid GitHub repository URL' }),

    [FIELD_NAME.PROJECT_ID_TYPE]: z.string(),
    [FIELD_NAME.PROJECT_ID]: z.string().trim().min(1),
    [FIELD_NAME.NETWORK]: z.string(),
    [FIELD_NAME.BUILD_IDL]: z.boolean(),
  })
  .refine(
    ({ projectIdType, projectId }) =>
      projectIdType === PROJECT_ID_TYPE.CARGO_TOML_PATH ? CARGO_TOML_PATH_REGEX.test(projectId) : true,
    {
      message: 'Invalid path to Cargo.toml',
      path: [FIELD_NAME.PROJECT_ID],
    },
  )
  .transform(({ version, repoLink, projectId, network, buildIdl, projectIdType, codeId }) => ({
    version,
    network,
    project: projectIdType === PROJECT_ID_TYPE.NAME ? { Name: projectId } : { ManifestPath: projectId },
    code_id: codeId,
    repo_link: repoLink,
    build_idl: buildIdl,
  }));

export { DEFAULT_VALUES, SCHEMA, NETWORK, FIELD_NAME, PROJECT_ID_TYPE, NETWORK_OPTIONS };
