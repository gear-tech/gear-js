import { HexString } from '@polkadot/util/types';
import { Button, Input } from '@gear-js/ui';
import { getProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchMetadata } from 'api';
import { useChain, useProgramActions } from 'hooks';
import { Subheader } from 'shared/ui/subheader';
import { UploadMetadata } from 'features/uploadMetadata';
import { Payload } from 'hooks/useProgramActions/types';
import { ProgramForm, RenderButtonsProps, SubmitHelpers } from 'widgets/programForm';
import { BackButton } from 'shared/ui/backButton';
import { ReactComponent as PlusSVG } from 'shared/assets/images/actions/plus.svg';
import { GasMethod } from 'shared/config';
import { RPCError, RPCErrorCode } from 'shared/services/rpcService';

import { PageParams } from '../model';
import styles from './InitializeProgram.module.scss';

const InitializeProgram = () => {
  const alert = useAlert();
  const { codeId } = useParams() as PageParams;

  const { isDevChain } = useChain();
  const { createProgram } = useProgramActions();

  // TODO: think about combining w/ useMetaOnUpload hook
  const [metaHex, setMetaHex] = useState<HexString>();
  const metadata = useMemo(() => (metaHex ? getProgramMetadata(metaHex) : undefined), [metaHex]);

  const [isMetaUploaded, setIsMetaUploaded] = useState(false);
  const [isUploadedMetaReady, setIsUploadedMetaReady] = useState(false);

  const setUploadedMetaHex = (value: HexString) => {
    setMetaHex(value);
    setIsMetaUploaded(true);
  };

  const setFileMetaHex = (value: HexString) => {
    setMetaHex(value);
    setIsMetaUploaded(false);
  };

  const resetMetaHex = () => setMetaHex(undefined);

  const handleSubmit = (payload: Payload, helpers: SubmitHelpers) =>
    createProgram({
      payload,
      codeId: codeId as HexString,
      resolve: () => {
        helpers.resetForm();
        helpers.enableButtons();

        if (!isMetaUploaded) resetMetaHex();
      },
      reject: helpers.enableButtons,
    });

  const renderButtons = ({ isDisabled }: RenderButtonsProps) => (
    <>
      <Button icon={PlusSVG} type="submit" text="Create Program" disabled={isDisabled} />
      <BackButton />
    </>
  );

  useEffect(() => {
    if (isDevChain) return setIsUploadedMetaReady(true);

    fetchMetadata({ codeHash: codeId as HexString })
      .then(({ result }) => setUploadedMetaHex(result.hex))
      .catch(({ code, message }: RPCError) => code !== RPCErrorCode.MetadataNotFound && alert.error(message))
      .finally(() => setIsUploadedMetaReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.initializeProgramPage}>
      <section className={styles.pageSection}>
        <Subheader size="big" title="Enter program parameters" />
        <div className={styles.lining}>
          <Input label="Code ID" value={codeId} direction="y" className={styles.codeId} block readOnly />
          <ProgramForm
            source={codeId as HexString}
            metaHex={metaHex}
            metadata={metadata}
            gasMethod={GasMethod.InitCreate}
            renderButtons={renderButtons}
            onSubmit={handleSubmit}
          />
        </div>
      </section>

      <section className={styles.pageSection}>
        <Subheader size="big" title="Add metadata" />
        <UploadMetadata
          metadata={metadata}
          isInputDisabled={isMetaUploaded}
          isLoading={!isUploadedMetaReady}
          onReset={resetMetaHex}
          onUpload={setFileMetaHex}
        />
      </section>
    </div>
  );
};

export { InitializeProgram };
