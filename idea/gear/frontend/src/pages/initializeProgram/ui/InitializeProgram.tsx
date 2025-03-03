import { useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { useParams } from 'react-router-dom';

import { UploadMetadata } from '@/features/uploadMetadata';
import { useContractApiWithFile, useLoading, useProgramActions } from '@/hooks';
import { Values } from '@/hooks/useProgramActions/types';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import { GasMethod } from '@/shared/config';
import { BackButton } from '@/shared/ui';
import { Subheader } from '@/shared/ui/subheader';
import { ProgramForm, SailsProgramForm, SubmitHelpers } from '@/widgets/programForm';

import { PageParams } from '../model';

import styles from './InitializeProgram.module.scss';

const InitializeProgram = () => {
  const { api, isApiReady } = useApi();
  const { codeId } = useParams() as PageParams;
  const { metadata, sails, isLoading, ...contractApi } = useContractApiWithFile(codeId);
  const createProgram = useProgramActions();
  const [isSubmitting, enableSubmitting, disableSubmitting] = useLoading();

  const handleSubmit = (payload: Values, helpers: SubmitHelpers) => {
    if (!isApiReady) throw new Error('API is not initialized');

    enableSubmitting();

    const { gasLimit, value, payload: initPayload, payloadType, keepAlive } = payload;
    const program = { value, codeId, gasLimit, initPayload, keepAlive };
    const result = api.program.create(program, metadata.value, payloadType);

    const onSuccess = () => {
      helpers.resetForm();
      metadata.reset();
      disableSubmitting();
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO(#1800): resolve eslint comments
    createProgram({ ...result, codeId }, { metadata, sails }, payload, onSuccess, disableSubmitting);
  };

  return (
    <div className={styles.container}>
      <section>
        <Subheader size="big" title="Enter program parameters" />

        {sails.value ? (
          <SailsProgramForm
            source={codeId}
            sails={sails.value}
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
      </section>

      <section>
        <Subheader size="big" title="Add metadata/sails" />

        <UploadMetadata
          value={contractApi.file}
          onChange={contractApi.handleChange}
          metadata={metadata.value}
          sails={sails.value}
          isDisabled={contractApi.isFromStorage}
          isLoading={isLoading}
        />
      </section>

      <div className={styles.buttons}>
        <BackButton size="medium" />
        <Button type="submit" form="programForm" icon={PlusSVG} text="Submit" disabled={isSubmitting} />
      </div>
    </div>
  );
};

export { InitializeProgram };
