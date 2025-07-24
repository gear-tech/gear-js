import { useWrappedVaraBalance } from '@/app/api';
import { AllEvents, RouterEvents, WrappedVaraEvents } from '@/app/store';
import { Badge, Balance, ExpandableItem, HashLink } from '@/components';
import { formatBalance } from '@/shared/utils';

import { Params } from '../params';

import styles from './activity-event.module.scss';

type Props = {
  item: AllEvents;
};

const ActivityEvent = ({ item }: Props) => {
  const { decimals } = useWrappedVaraBalance();

  if (item.type === RouterEvents.blockCommitted) {
    return null;
  }

  if (item.type === RouterEvents.codeValidationRequested) {
    const { type: _type, ...params } = item;
    return (
      <ExpandableItem
        header={
          <div className={styles.transaction}>
            Code <HashLink hash={item.codeId} /> validation requested.
          </div>
        }>
        <Params params={params} />
      </ExpandableItem>
    );
  }

  // Clarify if the design of events and my transactions is the same
  if (item.type === RouterEvents.codeGotValidated) {
    const error = 'Code id can not be found';
    return (
      <div className={styles.row}>
        {item.valid ? (
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

  if (item.type === RouterEvents.programCreated) {
    return (
      <div className={styles.transaction}>
        Program <HashLink hash={item.actorId} /> was created.
      </div>
    );
  }

  if (item.type === WrappedVaraEvents.approval) {
    const value = decimals ? formatBalance(BigInt(item.value), decimals) : null;

    return (
      <div className={styles.transaction}>
        Approve <Balance value={value} units="WVARA" /> <HashLink hash={item.owner} /> to{' '}
        <HashLink hash={item.spender} />
      </div>
    );
  }

  if (item.type === WrappedVaraEvents.transfer) {
    const value = decimals ? formatBalance(BigInt(item.value), decimals) : null;
    const { type: _type, ...originalParams } = item;
    const params = { ...originalParams, value: `${value} WVARA` };

    return (
      <ExpandableItem
        header={
          <div className={styles.transaction}>
            Balance transfer from <HashLink hash={item.from} /> to <HashLink hash={item.to} />
          </div>
        }>
        <Params params={params} />
      </ExpandableItem>
    );
  }

  return null;
};

export { ActivityEvent };
