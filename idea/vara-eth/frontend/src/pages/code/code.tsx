import { HexString } from '@vara-eth/api';
import { Link, useParams } from 'react-router-dom';

import { Badge, UploadIdlButton, SyntaxHighlighter, ChainEntity } from '@/components';
import { useGetCodeByIdQuery } from '@/features/codes/lib/queries';
import { routes } from '@/shared/config';
import { useIdlStorage } from '@/shared/hooks';

import styles from './code.module.scss';

type Params = {
  codeId: HexString;
};

const Code = () => {
  const { codeId } = useParams() as Params;

  const { data: code, isLoading } = useGetCodeByIdQuery(codeId);
  const { idl, saveIdl } = useIdlStorage(codeId);

  if (isLoading) {
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

          <div className={styles.services}>
            <Badge color={1} size="sm">
              SERVICE 1
            </Badge>

            <Badge color={2} size="sm">
              SERVICE 2
            </Badge>
          </div>

          <ChainEntity.Key>Programs</ChainEntity.Key>

          <Link to={routes.programs} className={styles.programs}>
            3 programs
          </Link>

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
