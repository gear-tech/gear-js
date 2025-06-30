import { useAlert, useApi } from '@gear-js/react-hooks';
import { Button, InputWrapper } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import { getErrorMessage } from '@/shared/helpers';
import { BackButton, Box, Input, LabeledCheckbox, Radio, Select } from '@/shared/ui';

import { useDockerImageVersions, useVerifyCode } from '../../api';
import { VERIFY_ROUTES } from '../../consts';
import { useDefaultCodeId } from '../../hooks';

import { DEFAULT_VALUES, SCHEMA, NETWORK, FIELD_NAME, PROJECT_ID_TYPE, NETWORK_OPTIONS } from './consts';
import styles from './verify-form.module.scss';

type Values = typeof DEFAULT_VALUES;
type FormattedValues = z.infer<typeof SCHEMA>;

const INPUT_GAP = '1.5/8.5';

function VerifyForm() {
  const defaultCodeId = useDefaultCodeId();
  const navigate = useNavigate();
  const alert = useAlert();

  const { data: dockerImageVersions } = useDockerImageVersions();

  const versionOptions = useMemo(
    () => dockerImageVersions?.map((version) => ({ label: version, value: version })) || [],
    [dockerImageVersions],
  );

  const { api, isApiReady } = useApi();
  const genesisHash = isApiReady ? api.genesisHash.toHex() : undefined;
  const defaultNetwork = genesisHash ? NETWORK[genesisHash as keyof typeof NETWORK] : undefined;

  const form = useForm<Values, unknown, FormattedValues>({
    defaultValues: {
      ...DEFAULT_VALUES,
      [FIELD_NAME.CODE_ID]: defaultCodeId || '',
      [FIELD_NAME.NETWORK]: defaultNetwork || DEFAULT_VALUES[FIELD_NAME.NETWORK],
    },

    resolver: zodResolver(SCHEMA),
  });

  const projectIdType = form.watch(FIELD_NAME.PROJECT_ID_TYPE);

  const { mutateAsync, isPending } = useVerifyCode();

  const handleSubmit = (values: FormattedValues) => {
    mutateAsync(values)
      .then(({ id }) => {
        navigate(generatePath(VERIFY_ROUTES.STATUS, { id }));

        alert.success('Code verification request sent');
      })
      .catch((error) => alert.error(getErrorMessage(error)));
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Box className={styles.box}>
          <Select
            name={FIELD_NAME.DOCKER_IMAGE_VERSION}
            options={versionOptions}
            label="Docker Image Version"
            gap={INPUT_GAP}
            disabled={!dockerImageVersions}
          />

          <Input
            name={FIELD_NAME.CODE_ID}
            label="Code Hash"
            placeholder="0x01"
            gap={INPUT_GAP}
            readOnly={Boolean(defaultCodeId)}
          />

          <Input
            name={FIELD_NAME.REPO_LINK}
            label="Link to Repository"
            placeholder="https://github.com/name/repo"
            gap={INPUT_GAP}
          />

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
            disabled={Boolean(defaultCodeId)}
          />

          <LabeledCheckbox name={FIELD_NAME.BUILD_IDL} label="Build IDL" inputLabel="" gap={INPUT_GAP} />

          <p className={styles.guideText}>
            How to build your program for verification.
            <a
              href="https://github.com/gear-tech/sails-program-verifier/blob/master/README.md"
              target="_blank"
              rel="noreferrer">
              Read the guide
            </a>
          </p>
        </Box>

        <footer className={styles.buttons}>
          <Button
            type="submit"
            icon={ApplySVG}
            text="Verify"
            color="secondary"
            size="large"
            disabled={!isApiReady || isPending || !dockerImageVersions}
          />

          <BackButton />
        </footer>
      </form>
    </FormProvider>
  );
}

export { VerifyForm };
