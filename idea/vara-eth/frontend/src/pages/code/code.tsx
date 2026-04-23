import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Hex } from 'viem';

import { ChainEntity, Skeleton, SyntaxHighlighter, Tabs, UploadIdlButton } from '@/components';
import { useGetCodeByIdQuery } from '@/features/codes/lib/queries';
import { ProgramsTable } from '@/features/programs';
import { SailsServices, useSails } from '@/features/sails';
import { useIdlStorage } from '@/shared/hooks';

import styles from './code.module.scss';

type Params = {
  codeId: Hex;
};

const TABS = ['Programs', 'IDL'] as const;

const Code = () => {
  const { codeId } = useParams() as Params;
  const [tabIndex, setTabIndex] = useState(0);

  const { data: code, isLoading } = useGetCodeByIdQuery(codeId);
  const { idl, saveIdl } = useIdlStorage(codeId);
  const sails = useSails(idl);

  if (!isLoading && !code) return <ChainEntity.NotFound entity="code" id={codeId} />;

  return (
    <div className={styles.container}>
      <div className={styles.data}>
        <ChainEntity.Header>
          <ChainEntity.BackButton />
          <ChainEntity.Title id={codeId} />
        </ChainEntity.Header>

        <ChainEntity.Data>
          <ChainEntity.Key>Services</ChainEntity.Key>
          {sails.isLoading && <Skeleton width="4rem" />}

          {!sails.isLoading &&
            (idl ? <SailsServices value={sails.data?.services || {}} /> : <div>No IDL uploaded.</div>)}

          <ChainEntity.Key>Created at</ChainEntity.Key>
          {isLoading ? <Skeleton width="16rem" /> : code && <ChainEntity.Date value={code.createdAt} />}
        </ChainEntity.Data>
      </div>

      <div className={styles.extraData}>
        <Tabs tabs={TABS} tabIndex={tabIndex} onTabIndexChange={setTabIndex} className={styles.tabs} />

        {tabIndex === 0 && (
          <ProgramsTable
            codeId={codeId}
            openPageSize={5}
            collapsedPageSize={18}
            positionedAt="bottom"
            truncateSize="xl"
          />
        )}

        {tabIndex === 1 && !sails.isLoading && (
          <div className={styles.idlContainer}>
            {idl ? (
              <SyntaxHighlighter language="rust" code={idl} />
            ) : (
              <div className={styles.emptyState}>
                <p>No IDL uploaded. Please upload an IDL file to view it here.</p>
                <UploadIdlButton onSaveIdl={saveIdl} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { Code };
