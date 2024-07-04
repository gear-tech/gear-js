import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { getCode } from '@/api';
import { useChain, useDataLoading, useModal, usePrograms } from '@/hooks';
import { BackButton } from '@/shared/ui/backButton';
import { absoluteRoutes } from '@/shared/config';
import { UILink } from '@/shared/ui/uiLink';
import { ProgramsList } from '@/pages/programs/ui/programsList';
import { MetadataTable, useMetadata } from '@/features/metadata';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import AddMetaSVG from '@/shared/assets/images/actions/addMeta.svg?react';
import { ICode } from '@/entities/code';
import { CodeTable } from '@/features/code';

import styles from './Code.module.scss';
import { IDL, useSails } from '@/features/sails';

type Params = { codeId: HexString };

const Code = () => {
  const { codeId } = useParams() as Params;
  const alert = useAlert();

  const { isDevChain } = useChain();
  const { showModal, closeModal } = useModal();

  const { programs, isLoading: isProgramsRequestLoading, fetchPrograms } = usePrograms();
  const { loadData } = useDataLoading({ defaultParams: { codeId }, fetchData: fetchPrograms });

  const [code, setCode] = useState<ICode>();
  const isCodeReady = code !== undefined;

  const { metadata, isMetadataReady, setMetadataHex } = useMetadata(code?.metahash);
  const { idl, isLoading: isSailsLoading, refetch: refetchSails } = useSails(codeId);
  const isLoading = !isMetadataReady || isSailsLoading;

  const setCodeName = (name: string) => setCode((prevCode) => (prevCode ? { ...prevCode, name } : prevCode));

  const showUploadMetadataModal = () => {
    const onSuccess = (name: string, metadataHex?: HexString) => {
      setCodeName(name);

      return metadataHex ? setMetadataHex(metadataHex) : refetchSails();
    };

    showModal('metadata', { codeId, onClose: closeModal, onSuccess });
  };

  useEffect(() => {
    if (isDevChain) return;

    getCode(codeId)
      .then(({ result }) => setCode(result))
      .catch(({ message }: Error) => alert.error(message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={styles.code}>
        <div className={styles.summary}>
          <div>
            <h2 className={styles.heading}>Code Parameters</h2>
            <CodeTable code={code} isCodeReady={isCodeReady} />
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
        {isCodeReady && (
          <UILink
            to={generatePath(absoluteRoutes.initializeProgram, { codeId })}
            text="Create program"
            icon={PlusSVG}
            size="large"
          />
        )}

        {!isDevChain && !isLoading && !metadata && !idl && (
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
