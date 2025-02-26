import { useWrappedVaraBalance } from '@/app/api';
import { MyActivity, TransactionTypes } from '@/app/store';
import { Badge, Balance, CopyButton, ExpandableItem, HashLink } from '@/components';
import { formatBalance } from '@/shared/utils';

import styles from './transaction.module.scss';

type Props = {
  item: MyActivity;
};

const Transaction = ({ item }: Props) => {
  const { decimals } = useWrappedVaraBalance();

  if (item.type === TransactionTypes.codeValidation) {
    const isSucces = item.resultStatus === 'success';
    // TODO: add error message
    const error = 'Code id can not be found';

    return (
      <div className={styles.row}>
        {isSucces ? (
          <>
            <Badge>Code approved</Badge>
            <div className={styles.transaction}>
              Code <HashLink hash={item.codeId} /> was approved.
            </div>
          </>
        ) : (
          <>
            <Badge color="danger">Code rejected</Badge>
            <div className={styles.transaction}>
              <span className={styles.error}>{error}</span> <HashLink hash={item.codeId} isDisabled />
            </div>
          </>
        )}
      </div>
    );
  }

  if (item.type === TransactionTypes.createProgram) {
    return (
      <div className={styles.transaction}>
        Program <HashLink hash={item.programId} /> was created.
      </div>
    );
  }

  if (item.type === TransactionTypes.approve) {
    const value = decimals ? formatBalance(BigInt(item.value), decimals) : null;

    return (
      <div className={styles.transaction}>
        Approve <Balance value={value} units="WVARA" /> <HashLink hash={item.owner} /> to{' '}
        <HashLink hash={item.spender} />
      </div>
    );
  }

  if (item.type === TransactionTypes.executableBalanceTopUp) {
    const value = decimals ? formatBalance(BigInt(item.value), decimals) : null;

    return (
      <div className={styles.transaction}>
        Top up executable balance <Balance value={value} units="WVARA" /> to <HashLink hash={item.programId} />
      </div>
    );
  }

  if (item.type === TransactionTypes.programMessage) {
    return (
      <ExpandableItem
        header={
          <div className={styles.transaction}>
            Message {item.hash && <HashLink hash={item.hash} />} to <HashLink hash={item.to || '-'} />
          </div>
        }>
        <div className={styles.params}>
          {item.params &&
            Object.entries(item.params).map(([key, value]) => (
              <div className={styles.param} key={key}>
                {key}: {String(value)} <CopyButton value={String(value)} />
              </div>
            ))}
        </div>
      </ExpandableItem>
    );
  }
};

export { Transaction };
