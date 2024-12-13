import { HexString } from '@gear-js/api';
import { Button, InputWrapper } from '@gear-js/ui';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import { BackButton, Box, Input, Radio, Select } from '@/shared/ui';

import styles from './verify-code.module.scss';

const FIELD_NAME = {
  DOCKER_IMAGE_VERSION: 'version',
  CODE_ID: 'codeId',
  REPO_LINK: 'repoLink',
  PROJECT_ID_TYPE: 'projectIdType',
  PROJECT_ID: 'projectId',
  NETWORK: 'network',
} as const;

const DOCKER_IMAGE_VERSION_OPTIONS = [
  { label: 'v0.1.0', value: '1' },
  { label: 'v0.2.0', value: '2' },
  { label: 'v0.3.0', value: '3' },
] as const;

const NETWORK_OPTIONS = [
  { label: 'Mainnet', value: 'vara_mainnet' },
  { label: 'Testnet', value: 'vara_testnet' },
] as const;

function VerifyCode() {
  const { codeId } = useParams<{ codeId: HexString }>();
  const form = useForm();

  const gap = '1.5/8.5';

  return (
    <>
      <h1 className={styles.heading}>Verify Code </h1>

      <FormProvider {...form}>
        <form>
          <Box className={styles.box}>
            <Select
              name={FIELD_NAME.DOCKER_IMAGE_VERSION}
              label="Docker Image Version"
              options={DOCKER_IMAGE_VERSION_OPTIONS}
              gap={gap}
            />

            <Input name={FIELD_NAME.CODE_ID} label="Code Hash" gap={gap} />

            <Input name={FIELD_NAME.REPO_LINK} label="Link to Repository" gap={gap} />

            <InputWrapper id="project" label="Project" direction="x" size="normal" gap={gap}>
              <Box className={styles.nestedBox}>
                <Radio name={FIELD_NAME.PROJECT_ID_TYPE} label="Name of the Project" />
                <Radio name={FIELD_NAME.PROJECT_ID_TYPE} label="Path to Cargo.toml" />
                <Input name={FIELD_NAME.PROJECT_ID} />
              </Box>
            </InputWrapper>

            <Select name={FIELD_NAME.NETWORK} label="Network" options={NETWORK_OPTIONS} gap={gap} />
          </Box>

          <footer className={styles.buttons}>
            <Button type="submit" icon={ApplySVG} text="Verify" color="secondary" size="large" />
            <BackButton />
          </footer>
        </form>
      </FormProvider>
    </>
  );
}

export { VerifyCode };
