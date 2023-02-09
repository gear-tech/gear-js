import { generateCodeHash, getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button, FileInput } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

import { useProgramActions } from 'hooks';
import { fetchCodeMetadata } from 'api';
import { readFileAsync } from 'shared/helpers';
import { formStyles } from 'shared/ui/form';
import { BackButton } from 'shared/ui/backButton';
import { RPCError, RPCErrorCode } from 'shared/services/rpcService';
import { ReactComponent as PlusSVG } from 'shared/assets/images/actions/plus.svg';
import { Subheader } from 'shared/ui/subheader';
import { FileTypes, GasMethod } from 'shared/config';
import { Payload } from 'hooks/useProgramActions/types';
import { UploadMetadata } from 'features/uploadMetadata';
import { ProgramForm, RenderButtonsProps, SubmitHelpers } from 'widgets/programForm';

import styles from './UploadProgram.module.scss';

type MetadataState = {
  value: ProgramMetadata | undefined;
  hex: HexString | undefined;
  isUploaded: boolean;
};

const initMeta = {
  value: undefined,
  hex: undefined,
  isUploaded: false,
};

const UploadProgram = () => {
  const alert = useAlert();
  const { uploadProgram } = useProgramActions();

  const { state } = useLocation();
  const initOptFile = state?.file as File | undefined;

  const [optFile, setOptFile] = useState(initOptFile);
  const [optBuffer, setOptBuffer] = useState<Buffer>();

  const [metadata, setMetadata] = useState<MetadataState>(initMeta);
  const [isUploadedMetaReady, setIsUploadedMetaReady] = useState(true);

  const fileInputClassName = clsx(formStyles.field, formStyles.gap16, styles.fileInput);

  const setUploadedMetadata = (hex: HexString) =>
    setMetadata({ hex, value: getProgramMetadata(hex), isUploaded: true });

  const setFileMetadata = (hex: HexString) => setMetadata({ hex, value: getProgramMetadata(hex), isUploaded: false });

  const resetOptFile = () => setOptFile(undefined);
  const resetOptBuffer = () => setOptBuffer(undefined);
  const resetMetadata = () => setMetadata(initMeta);

  useEffect(() => {
    if (!optFile) {
      resetOptBuffer();
      resetMetadata();

      return;
    }

    readFileAsync(optFile, 'buffer')
      .then((arrayBuffer) => Buffer.from(arrayBuffer))
      .then((result) => setOptBuffer(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optFile]);

  useEffect(() => {
    if (!optBuffer) return;

    setIsUploadedMetaReady(false);

    const codeId = generateCodeHash(optBuffer);

    fetchCodeMetadata(codeId)
      .then(({ result }) => setUploadedMetadata(result.hex))
      .catch(({ code, message }: RPCError) => {
        if (code !== RPCErrorCode.MetadataNotFound) alert.error(message);
      })
      .finally(() => setIsUploadedMetaReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optBuffer]);

  const renderButtons = ({ isDisabled }: RenderButtonsProps) => (
    <>
      <Button icon={PlusSVG} type="submit" text="Upload Program" size="large" disabled={isDisabled} />
      <BackButton />
    </>
  );

  const handleSubmit = (payload: Payload, { enableButtons }: SubmitHelpers) => {
    if (!optFile) return;

    uploadProgram({ file: optFile, payload, resolve: resetOptFile, reject: enableButtons });
  };

  return (
    <div className={styles.uploadProgramPage}>
      <section className={styles.pageSection}>
        <Subheader size="big" title="Enter program parameters" />

        <div className={styles.lining}>
          <FileInput
            value={optFile}
            label="Program file"
            direction="y"
            color="primary"
            className={fileInputClassName}
            onChange={setOptFile}
            accept={FileTypes.Wasm}
          />

          {optBuffer && (
            <ProgramForm
              source={optBuffer}
              metaHex={metadata.hex}
              metadata={metadata.value}
              gasMethod={GasMethod.InitUpdate}
              renderButtons={renderButtons}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </section>

      <section className={styles.pageSection}>
        <Subheader size="big" title="Add metadata" />
        <UploadMetadata
          metadata={metadata.value}
          isInputDisabled={!!metadata.isUploaded}
          isLoading={!isUploadedMetaReady}
          onReset={resetMetadata}
          onUpload={setFileMetadata}
        />
      </section>
    </div>
  );
};

export { UploadProgram };
