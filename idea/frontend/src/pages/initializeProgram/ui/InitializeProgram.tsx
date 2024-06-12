import { Button, Input } from '@gear-js/ui';
import { useParams } from 'react-router-dom';

import { useProgramActions } from '@/hooks';
import { Subheader } from '@/shared/ui/subheader';
import { UploadMetadata } from '@/features/uploadMetadata';
import { Payload } from '@/hooks/useProgramActions/types';
import { ProgramForm, RenderButtonsProps, SubmitHelpers } from '@/widgets/programForm';
import { BackButton } from '@/shared/ui/backButton';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import { GasMethod } from '@/shared/config';
import { useMetadataHash, useMetadataWithFile } from '@/features/metadata';

import { PageParams } from '../model';
import styles from './InitializeProgram.module.scss';

const InitializeProgram = () => {
  const { codeId } = useParams() as PageParams;
  const metadataHash = useMetadataHash(codeId);
  const metadata = useMetadataWithFile(metadataHash);
  const { createProgram } = useProgramActions();

  const handleSubmit = (payload: Payload, helpers: SubmitHelpers) =>
    createProgram({
      payload,
      codeId: codeId,
      resolve: () => {
        helpers.resetForm();
        helpers.enableButtons();
        metadata.reset();
      },
      reject: helpers.enableButtons,
    });

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

          <ProgramForm
            source={codeId}
            metaHex={metadata.hex}
            metadata={metadata.value}
            gasMethod={GasMethod.InitCreate}
            renderButtons={renderButtons}
            onSubmit={handleSubmit}
          />
        </div>
      </section>

      <section className={styles.pageSection}>
        <Subheader size="big" title="Add metadata" />

        <UploadMetadata
          metadata={metadata.value}
          isInputDisabled={metadata.isFromStorage}
          isLoading={!metadata.isReady}
          onReset={metadata.reset}
          onMetadataUpload={metadata.set}
        />
      </section>
    </div>
  );
};

export { InitializeProgram };
