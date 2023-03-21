import { getProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { generatePath, useParams } from 'react-router-dom';

import { addCodeMetadata } from 'api';
import { useChain, useDataLoading, useModal, usePrograms } from 'hooks';
import { BackButton } from 'shared/ui/backButton';
import { absoluteRoutes } from 'shared/config';
import { UILink } from 'shared/ui/uiLink';
import { Table, TableRow } from 'shared/ui/table';
import { IdBlock } from 'shared/ui/idBlock';
import { ProgramsList } from 'pages/programs/ui/programsList';
import { RequestParams } from 'pages/programs/model/types';
import { MetadataDetails } from 'pages/program/ui/metadataDetails';
import { ReactComponent as PlusSVG } from 'shared/assets/images/actions/plus.svg';
import { ReactComponent as AddMetaSVG } from 'shared/assets/images/actions/addMeta.svg';

import { useMetadata } from '../hooks';
import styles from './Code.module.scss';

type Params = { codeId: HexString };

const Code = () => {
  const { codeId } = useParams() as Params;
  const { isDevChain } = useChain();
  const alert = useAlert();

  const { showModal, closeModal } = useModal();
  const { metadata, isMetadataReady, updateMetadata } = useMetadata(codeId);

  const { programs, isLoading, totalCount, fetchPrograms } = usePrograms();
  const { loadData } = useDataLoading<RequestParams>({ defaultParams: { query: codeId }, fetchData: fetchPrograms });

  const handleUploadMetadataSubmit = ({ metaHex, name }: { metaHex: HexString; name: string }) => {
    addCodeMetadata({ id: codeId, metaHex, name })
      .then(() => {
        alert.success('Metadata for code uploaded successfully');
        closeModal();
        updateMetadata(getProgramMetadata(metaHex));
      })
      .catch(({ message }: Error) => alert.error(message));
  };

  const showUploadMetadataModal = () => showModal('metadata', { onSubmit: handleUploadMetadataSubmit, isCode: true });

  return (
    <>
      <div className={styles.code}>
        <div className={styles.summary}>
          <div>
            <h2 className={styles.heading}>Code Parameters</h2>

            <Table>
              <TableRow name="Code ID">
                <IdBlock id={codeId} size="big" />
              </TableRow>
            </Table>
          </div>

          <div>
            <h2 className={styles.heading}>Metadata</h2>
            <MetadataDetails metadata={metadata} isLoading={isLoading} />
          </div>
        </div>

        <div>
          <h2 className={styles.heading}>Programs</h2>
          <ProgramsList programs={programs} totalCount={totalCount} isLoading={isLoading} loadMorePrograms={loadData} />
        </div>
      </div>

      <div className={styles.buttons}>
        <UILink
          to={generatePath(absoluteRoutes.initializeProgram, { codeId })}
          text="Create program"
          icon={PlusSVG}
          size="large"
        />

        {!isDevChain && isMetadataReady && !metadata && (
          <Button text="Add metadata" icon={AddMetaSVG} color="light" size="large" onClick={showUploadMetadataModal} />
        )}

        <BackButton />
      </div>
    </>
  );
};

export { Code };
