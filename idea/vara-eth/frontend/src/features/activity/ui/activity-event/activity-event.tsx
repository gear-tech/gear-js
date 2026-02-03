import { useWrappedVaraBalance } from '@/app/api';
import { Badge, Balance, ExpandableItem, HashLink } from '@/components';
import { formatBalance } from '@/shared/utils';

import { Event, EVENT_NAME } from '../../lib/use-activity';
import { Params } from '../params';

import styles from './activity-event.module.scss';

type Props = Event;

const ActivityEvent = ({ name, args }: Props) => {
  const { decimals } = useWrappedVaraBalance();

  if (name === EVENT_NAME.ROUTER.CODE_VALIDATION_REQUESTED) {
    return (
      <ExpandableItem
        header={
          <div className={styles.transaction}>
            Code <HashLink hash={args.codeId} /> validation requested.
          </div>
        }>
        <Params params={args} />
      </ExpandableItem>
    );
  }

  // clarify whether it should look as my activity event
  if (name === EVENT_NAME.ROUTER.CODE_GOT_VALIDATED) {
    return (
      <div className={styles.row}>
        {args.valid ? (
          <>
            <Badge>Code approved</Badge>
            <div className={styles.transaction}>
              Code <HashLink hash={args.codeId} /> was approved.
            </div>
          </>
        ) : (
          <>
            <Badge color="danger">Code rejected</Badge>
            <div className={styles.transaction}>
              <span className={styles.error}>Code id can not be found</span> <HashLink hash={args.codeId} isDisabled />
            </div>
          </>
        )}
      </div>
    );
  }

  if (name === EVENT_NAME.ROUTER.PROGRAM_CREATED) {
    return (
      <div className={styles.transaction}>
        Program <HashLink hash={args.actorId} /> was created.
      </div>
    );
  }

  if (name === EVENT_NAME.WVARA.APPROVAL) {
    const value = decimals ? formatBalance(BigInt(args.value), decimals) : null;

    return (
      <div className={styles.transaction}>
        Approve <Balance value={value} units="WVARA" /> <HashLink hash={args.owner} /> to{' '}
        <HashLink hash={args.spender} />
      </div>
    );
  }

  if (name === EVENT_NAME.WVARA.TRANSFER) {
    const value = decimals ? formatBalance(BigInt(args.value), decimals) : null;

    return (
      <ExpandableItem
        header={
          <div className={styles.transaction}>
            Balance transfer from <HashLink hash={args.from} /> to <HashLink hash={args.to} />
          </div>
        }>
        <Params params={{ ...args, value: `${value} WVARA` }} />
      </ExpandableItem>
    );
  }
};

export { ActivityEvent };
