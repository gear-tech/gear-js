import { Hex } from '@gear-js/api';
import { generatePath, useParams } from 'react-router-dom';

import { useDataLoading, usePrograms } from 'hooks';
import { BackButton } from 'shared/ui/backButton';
import { absoluteRoutes } from 'shared/config';
import { UILink } from 'shared/ui/uiLink';
import { Table, TableRow } from 'shared/ui/table';
import { IdBlock } from 'shared/ui/idBlock';
import { ProgramsList } from 'pages/programs/ui/programsList';
import { RequestParams } from 'pages/programs/model/types';
import { MetadataDetails } from 'pages/program/ui/metadataDetails';
import { ReactComponent as PlusSVG } from 'shared/assets/images/actions/plus.svg';

import { useMetadata } from '../hooks';
import styles from './Code.module.scss';

type Params = { codeId: Hex };

const Code = () => {
  const { codeId } = useParams() as Params;

  const metadata = useMetadata(codeId);

  const { programs, isLoading, totalCount, fetchPrograms } = usePrograms();
  const { loadData } = useDataLoading<RequestParams>({ defaultParams: { query: codeId }, fetchData: fetchPrograms });

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

        <BackButton />
      </div>
    </>
  );
};

export { Code };
