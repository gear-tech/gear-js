import { HexString } from '@vara-eth/api';
import { useParams } from 'react-router-dom';

import { UploadIdlButton, SyntaxHighlighter, ChainEntity } from '@/components';
import { useGetCodeByIdQuery } from '@/features/codes/lib/queries';
import { useSails } from '@/features/programs/lib';
import { ServiceBadges } from '@/features/sails';
import { useIdlStorage } from '@/shared/hooks';

import styles from './code.module.scss';

type Params = {
  codeId: HexString;
};

const Code = () => {
  const { codeId } = useParams() as Params;

  const { data: code, isLoading } = useGetCodeByIdQuery(codeId);
  const { idl, saveIdl } = useIdlStorage(codeId);
  const sails = useSails(idl);

  if (isLoading || sails.isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>Loading...</div>
      </div>
    );
  }

  if (!code) {
    return <ChainEntity.NotFound entity="code" id={codeId} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ChainEntity.Header>
          <ChainEntity.BackButton />
          <ChainEntity.Title id={codeId} />
        </ChainEntity.Header>

        <ChainEntity.Data>
          <ChainEntity.Key>Services</ChainEntity.Key>
          {idl ? <ServiceBadges sails={sails.data} /> : <div>No IDL uploaded.</div>}

          <ChainEntity.Key>Created at</ChainEntity.Key>
          <ChainEntity.Date value={code.createdAt} />
        </ChainEntity.Data>
      </div>

      <div className={styles.card}>
        {idl ? (
          <SyntaxHighlighter language="rust" code={idl} />
        ) : (
          <div className={styles.emptyState}>
            <p>No IDL uploaded. Please upload an IDL file to view it here.</p>
            <UploadIdlButton onSaveIdl={saveIdl} />
          </div>
        )}
      </div>
    </div>
  );
};

export { Code };
