import { useWrappedVaraBalance } from '@/app/api';
import { Badge, Balance, ExpandableItem, HashLink } from '@/components';
import { formatBalance } from '@/shared/utils';

import { Event, EventArgs } from '../../lib/use-activity';
import { Params } from '../params';

import styles from './activity-event.module.scss';

type Props = Event;

const CodeValidationRequestedEvent = ({ codeId }: EventArgs<'CodeValidationRequested'>) => {
  return (
    <div className={styles.transaction}>
      Code <HashLink hash={codeId} /> validation requested.
    </div>
  );
};

// should it look like my activity event?
const CodeValidatedEvent = ({ valid, codeId }: EventArgs<'CodeGotValidated'>) => {
  return (
    <div className={styles.row}>
      <Badge color={valid ? 'primary' : 'danger'}>Code {valid ? 'approved' : 'rejected'}</Badge>

      <div className={styles.transaction}>
        {valid ? (
          <>
            Code <HashLink hash={codeId} /> was approved.
          </>
        ) : (
          <>
            <span className={styles.error}>Code validation rejected.</span> <HashLink hash={codeId} isDisabled />
          </>
        )}
      </div>
    </div>
  );
};

const ProgramCreatedEvent = ({ actorId }: EventArgs<'ProgramCreated'>) => {
  return (
    <div className={styles.transaction}>
      Program <HashLink hash={actorId} /> was created.
    </div>
  );
};

const ApprovalEvent = ({ owner, spender, ...props }: EventArgs<'Approval'>) => {
  const { decimals } = useWrappedVaraBalance();
  const value = decimals ? formatBalance(BigInt(props.value), decimals) : null;

  return (
    <div className={styles.transaction}>
      Approve <Balance value={value} units="WVARA" /> <HashLink hash={owner} /> to <HashLink hash={spender} />
    </div>
  );
};

const TransferEvent = ({ from, to, ...props }: EventArgs<'Transfer'>) => {
  const { decimals } = useWrappedVaraBalance();
  const value = decimals ? formatBalance(BigInt(props.value), decimals) : null;

  return (
    <div className={styles.transaction}>
      Balance transfer <Balance value={value} units="WVARA" /> from <HashLink hash={from} /> to <HashLink hash={to} />
    </div>
  );
};

const ActivityEvent = ({ name, args }: Props) => {
  switch (name) {
    case 'CodeValidationRequested':
      return <CodeValidationRequestedEvent {...args} />;

    case 'CodeGotValidated':
      return <CodeValidatedEvent {...args} />;

    case 'ProgramCreated':
      return <ProgramCreatedEvent {...args} />;

    case 'Approval':
      return <ApprovalEvent {...args} />;

    case 'Transfer':
      return <TransferEvent {...args} />;

    default:
      return (
        <ExpandableItem header={name}>
          <Params params={args} />
        </ExpandableItem>
      );
  }
};

export { ActivityEvent };
