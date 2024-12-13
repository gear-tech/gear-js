import { HexString } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { Button, InputWrapper } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import { GENESIS } from '@/shared/config';
import { getErrorMessage, isHex } from '@/shared/helpers';
import { BackButton, Box, Input, LabeledCheckbox, Radio, Select } from '@/shared/ui';

import styles from './verify-code.module.scss';

const FIELD_NAME = {
  DOCKER_IMAGE_VERSION: 'version',
  CODE_ID: 'codeId',
  REPO_LINK: 'repoLink',
  PROJECT_ID_TYPE: 'projectIdType',
  PROJECT_ID: 'projectId',
  NETWORK: 'network',
  BUILD_IDL: 'buildIdl',
} as const;

const DOCKER_IMAGE_VERSION_OPTIONS = [
  { label: 'v0.1.0', value: '1' },
  { label: 'v0.2.0', value: '2' },
  { label: 'v0.3.0', value: '3' },
] as const;

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
  [FIELD_NAME.DOCKER_IMAGE_VERSION]: DOCKER_IMAGE_VERSION_OPTIONS[0]
    .value as typeof DOCKER_IMAGE_VERSION_OPTIONS[number]['value'],
  [FIELD_NAME.CODE_ID]: '',
  [FIELD_NAME.REPO_LINK]: '',
  [FIELD_NAME.PROJECT_ID_TYPE]: PROJECT_ID_TYPE.NAME as typeof PROJECT_ID_TYPE[keyof typeof PROJECT_ID_TYPE],
  [FIELD_NAME.PROJECT_ID]: '',
  [FIELD_NAME.NETWORK]: NETWORK_OPTIONS[0].value as typeof NETWORK_OPTIONS[number]['value'],
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

type Values = typeof DEFAULT_VALUES;
type FormattedValues = z.infer<typeof SCHEMA>;

const INPUT_GAP = '1.5/8.5';

function VerifyCode() {
  const { codeId } = useParams<{ codeId: HexString }>();

  const { api, isApiReady } = useApi();
  const genesisHash = isApiReady ? api.genesisHash.toHex() : undefined;
  const readOnlyNetwork = codeId && genesisHash ? NETWORK[genesisHash as keyof typeof NETWORK] : undefined;

  const alert = useAlert();

  const form = useForm<Values, unknown, FormattedValues>({
    defaultValues: {
      ...DEFAULT_VALUES,
      [FIELD_NAME.CODE_ID]: codeId || '',
      [FIELD_NAME.NETWORK]: readOnlyNetwork || DEFAULT_VALUES[FIELD_NAME.NETWORK],
    },

    resolver: zodResolver(SCHEMA),
  });

  const projectIdType = form.watch(FIELD_NAME.PROJECT_ID_TYPE);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['verifyCode'],
    mutationFn: (values: FormattedValues) => Promise.resolve(values),
  });

  const handleSubmit = (values: FormattedValues) => {
    mutateAsync(values)
      .then(({ version, repoLink, projectId, network, buildIdl, codeId: codeIdValue }) => {
        console.log({
          version,
          network,
          codeId: codeIdValue,
          repo_link: repoLink,
          project_name: projectIdType === PROJECT_ID_TYPE.NAME ? projectId : '',
          cargo_toml_path: projectIdType === PROJECT_ID_TYPE.CARGO_TOML_PATH ? projectId : '',
          build_idl: buildIdl,
        });

        alert.success('Code verified successfully');
      })
      .catch((error) => alert.error(getErrorMessage(error)));
  };

  return (
    <>
      <h1 className={styles.heading}>Verify Code </h1>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Box className={styles.box}>
            <Select
              name={FIELD_NAME.DOCKER_IMAGE_VERSION}
              label="Docker Image Version"
              options={DOCKER_IMAGE_VERSION_OPTIONS}
              gap={INPUT_GAP}
            />

            <Input name={FIELD_NAME.CODE_ID} label="Code Hash" gap={INPUT_GAP} readOnly={Boolean(codeId)} />

            <Input name={FIELD_NAME.REPO_LINK} label="Link to Repository" gap={INPUT_GAP} />

            <InputWrapper id="project" label="Project" direction="x" size="normal" gap={INPUT_GAP}>
              <Box className={styles.nestedBox}>
                <Radio name={FIELD_NAME.PROJECT_ID_TYPE} value={PROJECT_ID_TYPE.NAME} label="Name of the Project" />

                <Radio
                  name={FIELD_NAME.PROJECT_ID_TYPE}
                  value={PROJECT_ID_TYPE.CARGO_TOML_PATH}
                  label="Path to Cargo.toml"
                />

                <Input
                  name={FIELD_NAME.PROJECT_ID}
                  placeholder={projectIdType === PROJECT_ID_TYPE.NAME ? 'Name' : 'folder/Cargo.toml'}
                />
              </Box>
            </InputWrapper>

            <Select
              name={FIELD_NAME.NETWORK}
              label="Network"
              options={NETWORK_OPTIONS}
              gap={INPUT_GAP}
              disabled={Boolean(readOnlyNetwork)}
            />

            <LabeledCheckbox name={FIELD_NAME.BUILD_IDL} label="Build IDL" inputLabel="" gap={INPUT_GAP} />
          </Box>

          <footer className={styles.buttons}>
            <Button
              type="submit"
              icon={ApplySVG}
              text="Verify"
              color="secondary"
              size="large"
              disabled={!isApiReady || isPending}
            />

            <BackButton />
          </footer>
        </form>
      </FormProvider>
    </>
  );
}

export { VerifyCode };
