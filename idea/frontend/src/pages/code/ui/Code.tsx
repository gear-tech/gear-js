import { useAlert, useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { addMetadata, addCodeName, getCode } from '@/api';
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

type Params = { codeId: HexString };

const Code = () => {
  const { codeId } = useParams() as Params;
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const { isDevChain } = useChain();
  const { showModal, closeModal } = useModal();

  const { programs, isLoading, fetchPrograms } = usePrograms();
  const { loadData } = useDataLoading({ defaultParams: { codeId }, fetchData: fetchPrograms });

  const [code, setCode] = useState<ICode>();
  const isCodeReady = code !== undefined;

  const { metadata, isMetadataReady, setMetadata } = useMetadata(code?.metahash);

  const setCodeName = (name: string) => setCode((prevCode) => (prevCode ? { ...prevCode, name } : prevCode));

  const handleUploadMetadataSubmit = ({ metaHex, name }: { metaHex: HexString; name: string }) => {
    const id = codeId;

    addCodeName({ id, name })
      .then(async () => {
        if (!isApiReady) throw new Error('API is not initialized');

        const hash = await api.code.metaHash(id);
        addMetadata(hash);
      })
      .then(() => {
        setMetadata(ProgramMetadata.from(metaHex));
        setCodeName(name);

        alert.success('Metadata for code uploaded successfully');

        closeModal();
      })
      .catch(({ message }: Error) => alert.error(message));
  };

  const showUploadMetadataModal = () => showModal('metadata', { onSubmit: handleUploadMetadataSubmit, isCode: true });

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
            <h2 className={styles.heading}>Metadata</h2>
            <MetadataTable metadata={metadata} isLoading={!isMetadataReady} />
          </div>
        </div>

        <div>
          <h2 className={styles.heading}>Programs</h2>
          <ProgramsList
            programs={programs}
            totalCount={programs.length}
            isLoading={isLoading}
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

        {!isDevChain && isMetadataReady && !metadata && (
          <Button text="Add metadata" icon={AddMetaSVG} color="light" size="large" onClick={showUploadMetadataModal} />
        )}

        <BackButton />
      </div>
    </>
  );
};

export { Code };
