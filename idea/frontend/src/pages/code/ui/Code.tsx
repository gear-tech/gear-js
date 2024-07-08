import { Button } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { generatePath, useParams } from 'react-router-dom';

import { useChain, useDataLoading, useModal, usePrograms } from '@/hooks';
import { BackButton } from '@/shared/ui/backButton';
import { absoluteRoutes } from '@/shared/config';
import { UILink } from '@/shared/ui/uiLink';
import { ProgramsList } from '@/pages/programs/ui/programsList';
import { MetadataTable, useMetadata } from '@/features/metadata';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import AddMetaSVG from '@/shared/assets/images/actions/addMeta.svg?react';
import { CodeTable, useCode as useStorageCode } from '@/features/code';
import { IDL, useSails } from '@/features/sails';
import { useLocalCode } from '@/features/local-indexer';

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

  const { programs, isLoading: isProgramsRequestLoading, fetchPrograms } = usePrograms();
  const { loadData } = useDataLoading({ defaultParams: { codeId }, fetchData: fetchPrograms });

  const { metadata, isMetadataReady, setMetadataHex } = useMetadata(code.data?.metahash);
  const { idl, isLoading: isSailsLoading, refetch: refetchSails } = useSails(codeId);
  const isLoading = !isMetadataReady || isSailsLoading;

  const showUploadMetadataModal = () => {
    const onSuccess = (_name: string, metadataHex?: HexString) => {
      code.refetch();

      return metadataHex ? setMetadataHex(metadataHex) : refetchSails();
    };

    showModal('metadata', { codeId, metadataHash: code.data?.metahash, onClose: closeModal, onSuccess });
  };

  return (
    <>
      <div className={styles.code}>
        <div className={styles.summary}>
          <div>
            <h2 className={styles.heading}>Code Parameters</h2>
            <CodeTable code={code.data} isCodeReady={!code.isPending} />
          </div>

          <div>
            {metadata && <h2 className={styles.heading}>Metadata</h2>}
            {idl && <h2 className={styles.heading}>IDL</h2>}

            {(isLoading || metadata) && <MetadataTable metadata={metadata} isLoading={isLoading} />}
            {/* temp solution for a placeholder */}
            {!isLoading && !metadata && !idl && <MetadataTable metadata={metadata} isLoading={isLoading} />}
            {idl && <IDL value={idl} />}
          </div>
        </div>

        <div>
          <h2 className={styles.heading}>Programs</h2>
          <ProgramsList
            programs={programs}
            totalCount={programs.length}
            isLoading={isProgramsRequestLoading}
            loadMorePrograms={loadData}
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

        {!isLoading && !metadata && !idl && (
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
