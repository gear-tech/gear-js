import { useWrappedVaraBalance } from '@/app/api';
import { Badge, Balance, HashLink } from '@/components';
import { formatBalance } from '@/shared/utils';

import {
  CodeValidatedEvent as CodeValidatedEventType,
  CodeValidationRequestedEvent as CodeValidationRequestedEventType,
  Event,
  EVENT_NAME,
  ProgramCreatedEvent as ProgramCreatedEventType,
  ApprovalEvent as ApprovalEventType,
  TransferEvent as TransferEventType,
} from '../../lib/use-activity';
import { Params } from '../params';

import styles from './activity-event.module.scss';

type Props = Event;

const CodeValidationRequestedEvent = ({ codeId }: CodeValidationRequestedEventType['args']) => {
  return (
    <div className={styles.transaction}>
      Code <HashLink hash={codeId} /> validation requested.
    </div>
  );
};

// should it look like my activity event?
const CodeValidatedEvent = ({ valid, codeId }: CodeValidatedEventType['args']) => {
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

const ProgramCreatedEvent = ({ actorId }: ProgramCreatedEventType['args']) => {
  return (
    <div className={styles.transaction}>
      Program <HashLink hash={actorId} /> was created.
    </div>
  );
};

const ApprovalEvent = ({ owner, spender, ...props }: ApprovalEventType['args']) => {
  const { decimals } = useWrappedVaraBalance();
  const value = decimals ? formatBalance(BigInt(props.value), decimals) : null;

  return (
    <div className={styles.transaction}>
      Approve <Balance value={value} units="WVARA" /> <HashLink hash={owner} /> to <HashLink hash={spender} />
    </div>
  );
};

const TransferEvent = ({ from, to, ...props }: TransferEventType['args']) => {
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
    case EVENT_NAME.ROUTER.CODE_VALIDATION_REQUESTED:
      return <CodeValidationRequestedEvent {...args} />;

    case EVENT_NAME.ROUTER.CODE_VALIDATED:
      return <CodeValidatedEvent {...args} />;

    case EVENT_NAME.ROUTER.PROGRAM_CREATED:
      return <ProgramCreatedEvent {...args} />;

    case EVENT_NAME.WVARA.APPROVAL:
      return <ApprovalEvent {...args} />;

    case EVENT_NAME.WVARA.TRANSFER:
      return <TransferEvent {...args} />;

    default:
      return (
        <div className={styles.transaction}>
          {name} event. {args && <Params params={args} />}
        </div>
      );
  }
};

export { ActivityEvent };
