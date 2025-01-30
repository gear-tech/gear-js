import { Button } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { generatePath, useParams } from 'react-router-dom';

import { useChain, useModal } from '@/hooks';
import { BackButton } from '@/shared/ui/backButton';
import { absoluteRoutes } from '@/shared/config';
import { UILink } from '@/shared/ui/uiLink';
import { Programs, usePrograms } from '@/features/program';
import { MetadataTable, useMetadata } from '@/features/metadata';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import AddMetaSVG from '@/shared/assets/images/actions/addMeta.svg?react';
import { CodeTable, useCode as useStorageCode } from '@/features/code';
import { SailsPreview, useSails } from '@/features/sails';
import { useLocalCode } from '@/features/local-indexer';
import { useIsCodeVerified, VerificationStatus, VerifyLink } from '@/features/code-verifier';
import { Box } from '@/shared/ui';

import styles from './Code.module.scss';

type Params = {
  codeId: HexString;
};

const Code = () => {
  const { isDevChain } = useChain();
  const { showModal, closeModal } = useModal();

  const { codeId } = useParams() as Params;
  const storageCode = useStorageCode(codeId);
  const localCode = useLocalCode(codeId);
  const code = isDevChain ? localCode : storageCode;

  const { data: isCodeVerified } = useIsCodeVerified(codeId);
  const programs = usePrograms({ codeId });

  const { metadata, isMetadataReady, setMetadataHex } = useMetadata(code.data?.metahash);
  const { sails, isLoading: isSailsLoading, refetch: refetchSails } = useSails(codeId);
  const isLoading = !isMetadataReady || isSailsLoading;

  const showUploadMetadataModal = () => {
    const onSuccess = (_name: string, metadataHex?: HexString) => {
      code.refetch();

      return metadataHex ? setMetadataHex(metadataHex) : refetchSails();
    };

    const isNameEditable = !isDevChain;

    showModal('metadata', {
      codeId,
      metadataHash: code.data?.metahash,
      isNameEditable,
      onClose: closeModal,
      onSuccess,
    });
  };

  return (
    <>
      <div className={styles.code}>
        <div className={styles.summary}>
          <div>
            <header className={styles.codeHeader}>
              <h2 className={styles.heading}>Code Parameters</h2>

              {isCodeVerified && <VerificationStatus value="verified" />}
            </header>

            <CodeTable code={code.data} isCodeReady={!code.isPending} />
          </div>

          <div>
            <h2 className={styles.heading}>Metadata/Sails</h2>

            {sails ? (
              <Box>
                <SailsPreview value={sails} />
              </Box>
            ) : (
              <MetadataTable metadata={metadata} isLoading={isLoading} />
            )}
          </div>
        </div>

        <div>
          <header className={styles.programsHeader}>
            <h2 className={styles.heading}>Programs</h2>

            {typeof isCodeVerified === 'boolean' && !isCodeVerified && <VerifyLink codeId={codeId} />}
          </header>

          <Programs
            items={programs.data?.result}
            isLoading={programs.isLoading}
            hasMore={programs.hasNextPage}
            fetchMore={programs.fetchNextPage}
          />
        </div>
      </div>

      <div className={styles.buttons}>
        {!code.isPending && (
          <UILink
            to={generatePath(absoluteRoutes.initializeProgram, { codeId })}
            text="Create program"
            icon={PlusSVG}
            size="large"
          />
        )}

        {!isLoading && !metadata && !sails && (
          <Button
            text="Add metadata/sails"
            icon={AddMetaSVG}
            color="light"
            size="large"
            onClick={showUploadMetadataModal}
          />
        )}

        <BackButton />
      </div>
    </>
  );
};

export { Code };
