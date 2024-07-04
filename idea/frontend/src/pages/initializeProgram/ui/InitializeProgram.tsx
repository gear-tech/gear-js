import { useApi } from '@gear-js/react-hooks';
import { Button, Input } from '@gear-js/ui';
import { useParams } from 'react-router-dom';

import { useContractApiWithFile, useProgramActions } from '@/hooks';
import { Subheader } from '@/shared/ui/subheader';
import { UploadMetadata } from '@/features/uploadMetadata';
import { Payload } from '@/hooks/useProgramActions/types';
import { ProgramForm, RenderButtonsProps, SailsProgramForm, SubmitHelpers } from '@/widgets/programForm';
import { BackButton } from '@/shared/ui/backButton';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import { GasMethod } from '@/shared/config';

import { PageParams } from '../model';
import styles from './InitializeProgram.module.scss';

const InitializeProgram = () => {
  const { api, isApiReady } = useApi();
  const { codeId } = useParams() as PageParams;
  const { metadata, sails, isLoading, ...contractApi } = useContractApiWithFile(codeId);
  const createProgram = useProgramActions();

  const handleSubmit = (payload: Payload, helpers: SubmitHelpers) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const { gasLimit, value, initPayload, payloadType, keepAlive } = payload;
    const program = { value, codeId, gasLimit, initPayload, keepAlive };
    const result = api.program.create(program, payload.metadata, payloadType);

    const onSuccess = () => {
      helpers.resetForm();
      helpers.enableButtons();
      metadata.reset();
    };

    createProgram(result, codeId, payload, onSuccess, helpers.enableButtons);
  };

  const renderButtons = ({ isDisabled }: RenderButtonsProps) => (
    <>
      <Button icon={PlusSVG} type="submit" text="Create Program" disabled={isDisabled} />
      <BackButton />
    </>
  );

  return (
    <div className={styles.initializeProgramPage}>
      <section className={styles.pageSection}>
        <Subheader size="big" title="Enter program parameters" />
        <div className={styles.lining}>
          <Input label="Code ID" value={codeId} direction="y" className={styles.codeId} block readOnly />

          {sails.value && sails.idl ? (
            <SailsProgramForm
              source={codeId}
              sails={sails.value}
              idl={sails.idl}
              gasMethod={GasMethod.InitCreate}
              renderButtons={renderButtons}
              onSubmit={handleSubmit}
            />
          ) : (
            <ProgramForm
              source={codeId}
              metaHex={metadata.hex}
              metadata={metadata.value}
              gasMethod={GasMethod.InitCreate}
              renderButtons={renderButtons}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </section>

      <section className={styles.pageSection}>
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
    </div>
  );
};

export { InitializeProgram };
