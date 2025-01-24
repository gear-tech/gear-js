import { useAlert, useApi } from '@gear-js/react-hooks';
import { Button, InputWrapper } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import { getErrorMessage } from '@/shared/helpers';
import { BackButton, Box, Input, LabeledCheckbox, Radio, Select } from '@/shared/ui';

import { verifyCode } from '../../api';
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

  const { api, isApiReady } = useApi();
  const genesisHash = isApiReady ? api.genesisHash.toHex() : undefined;
  const readOnlyNetwork = defaultCodeId && genesisHash ? NETWORK[genesisHash as keyof typeof NETWORK] : undefined;

  const alert = useAlert();

  const form = useForm<Values, unknown, FormattedValues>({
    defaultValues: {
      ...DEFAULT_VALUES,
      [FIELD_NAME.CODE_ID]: defaultCodeId || '',
      [FIELD_NAME.NETWORK]: readOnlyNetwork || DEFAULT_VALUES[FIELD_NAME.NETWORK],
    },

    resolver: zodResolver(SCHEMA),
  });

  const projectIdType = form.watch(FIELD_NAME.PROJECT_ID_TYPE);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['verifyCode'],
    mutationFn: verifyCode,
  });

  const handleSubmit = ({ version, repoLink, projectId, network, buildIdl, codeId: codeIdValue }: FormattedValues) => {
    const project = projectIdType === PROJECT_ID_TYPE.NAME ? { Name: projectId } : { PathToCargoToml: projectId };

    mutateAsync({ version, network, project, code_id: codeIdValue, repo_link: repoLink, build_idl: buildIdl })
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
          <Input
            name={FIELD_NAME.DOCKER_IMAGE_VERSION}
            placeholder="0.1.0"
            label="Docker Image Version"
            gap={INPUT_GAP}
          />

          <Input name={FIELD_NAME.CODE_ID} label="Code Hash" gap={INPUT_GAP} readOnly={Boolean(defaultCodeId)} />
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
  );
}

export { VerifyForm };
