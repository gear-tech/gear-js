import { useApi } from '@gear-js/react-hooks';
import { Button, Input } from '@gear-js/ui';
import { useParams } from 'react-router-dom';

import { useContractApiWithFile, useProgramActions } from '@/hooks';
import { Subheader } from '@/shared/ui/subheader';
import { UploadMetadata } from '@/features/uploadMetadata';
import { Values } from '@/hooks/useProgramActions/types';
import { ProgramForm, SailsProgramForm, SubmitHelpers } from '@/widgets/programForm';
import { GasMethod } from '@/shared/config';
import { BackButton, Box } from '@/shared/ui';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';

import { PageParams } from '../model';
import styles from './InitializeProgram.module.scss';

const InitializeProgram = () => {
  const { api, isApiReady } = useApi();
  const { codeId } = useParams() as PageParams;
  const { metadata, sails, isLoading, ...contractApi } = useContractApiWithFile(codeId);
  const createProgram = useProgramActions();

  const handleSubmit = (payload: Values, helpers: SubmitHelpers) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const { gasLimit, value, payload: initPayload, payloadType, keepAlive } = payload;
    const program = { value, codeId, gasLimit, initPayload, keepAlive };
    const result = api.program.create(program, metadata.value, payloadType);

    const onSuccess = () => {
      helpers.resetForm();
      helpers.enableButtons();
      metadata.reset();
    };

    createProgram({ ...result, codeId }, { metadata, sails }, payload, onSuccess, helpers.enableButtons);
  };

  return (
    <div className={styles.container}>
      <section>
        <Subheader size="big" title="Enter program parameters" />

        <div className={styles.program}>
          <Box>
            <Input label="Code ID" value={codeId} direction="y" block readOnly />
          </Box>

          {sails.value && sails.idl ? (
            <SailsProgramForm
              source={codeId}
              sails={sails.value}
              idl={sails.idl}
              gasMethod={GasMethod.InitCreate}
              onSubmit={handleSubmit}
            />
          ) : (
            <ProgramForm
              source={codeId}
              metadata={metadata.value}
              gasMethod={GasMethod.InitCreate}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </section>

      <section>
        <Subheader size="big" title="Add metadata/sails" />

        <UploadMetadata
          value={contractApi.file}
          onChange={contractApi.handleChange}
          metadata={metadata.value}
          idl={sails.idl}
          isDisabled={contractApi.isFromStorage}
          isLoading={isLoading}
        />
      </section>

      <div className={styles.buttons}>
        <BackButton />
        <Button type="submit" icon={PlusSVG} text="Submit" size="large" />
      </div>
    </div>
  );
};

export { InitializeProgram };
