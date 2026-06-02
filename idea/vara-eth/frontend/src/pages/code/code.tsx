import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Hex } from 'viem';
import { nodeAtom } from '@/app/store';
import LoadingIcon from '@/assets/icons/loading.svg?react';
import { ChainEntity, Skeleton, SyntaxHighlighter, Tabs, UploadIdlButton } from '@/components';
import { useGetCodeByIdQuery } from '@/features/codes/lib/queries';
import { CODE_VALIDATION_JOB_RESOLVED_EVENT } from '@/features/codes/lib/use-code-validation-polling';
import { hasPendingValidationJobByCodeId } from '@/features/codes/lib/validation-jobs-storage';
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
  const { ethChainId } = useAtomValue(nodeAtom);

  const { data: code, isLoading, refetch } = useGetCodeByIdQuery(codeId);
  const { idl, saveIdl } = useIdlStorage(codeId);
  const sails = useSails(idl);
  const [hasPendingValidation, setHasPendingValidation] = useState(() =>
    hasPendingValidationJobByCodeId(ethChainId, codeId),
  );

  useEffect(() => {
    setHasPendingValidation(hasPendingValidationJobByCodeId(ethChainId, codeId));
  }, [ethChainId, codeId]);

  useEffect(() => {
    const onValidationJobResolved = (event: Event) => {
      const { detail } = event as CustomEvent<{ codeId?: string }>;

      if (detail.codeId?.toLowerCase() === codeId.toLowerCase()) {
        setHasPendingValidation(false);
        void refetch();
      }
    };

    window.addEventListener(CODE_VALIDATION_JOB_RESOLVED_EVENT, onValidationJobResolved);

    return () => {
      window.removeEventListener(CODE_VALIDATION_JOB_RESOLVED_EVENT, onValidationJobResolved);
    };
  }, [codeId, refetch]);

  const showPendingValidation = !isLoading && !code && hasPendingValidation;

  if (showPendingValidation) {
    return (
      <div className={styles.container}>
        <div className={styles.data}>
          <ChainEntity.Header>
            <ChainEntity.BackButton />
            <ChainEntity.Title id={codeId} />
          </ChainEntity.Header>

          <ChainEntity.Data>
            <div className={styles.pendingValidation}>
              <LoadingIcon className={styles.pendingSpinner} />
              <h2>Code validation in progress</h2>
            </div>
          </ChainEntity.Data>
        </div>
      </div>
    );
  }

  if (!isLoading && !code && !hasPendingValidation) return <ChainEntity.NotFound entity="code" id={codeId} />;

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
            collapsedPageSize={15}
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
