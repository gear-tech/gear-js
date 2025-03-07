import clsx from 'clsx';
import { Link, generatePath } from 'react-router-dom';

import { LocalProgram } from '@/features/local-indexer';
import { IssueVoucher, VoucherBadge } from '@/features/voucher';
import sendSVG from '@/shared/assets/images/actions/send.svg?react';
import { absoluteRoutes } from '@/shared/config';
import { ActionLink } from '@/shared/ui/ActionLink';
import { BulbBlock } from '@/shared/ui/bulbBlock';
import { IdBlock } from '@/shared/ui/idBlock';
import { TimestampBlock } from '@/shared/ui/timestampBlock';

import { Program } from '../../api';
import { PROGRAM_STATUS_NAME, ProgramStatus } from '../../consts';
import { getBulbStatus } from '../../utils';

import styles from './program-card.module.scss';

type Props = {
  program: Program | LocalProgram;
  vertical?: boolean;
};

const ProgramCard = ({ program, vertical }: Props) => {
  const { id: programId, name, status } = program;
  const statusName = PROGRAM_STATUS_NAME[status];

  return (
    <article className={clsx(styles.programCard, vertical && styles.vertical)}>
      <VoucherBadge programId={programId} />

      <div className={styles.content}>
        <Link to={generatePath(absoluteRoutes.program, { programId })} className={styles.link}>
          <h2 className={styles.name}>{name}</h2>
        </Link>

        <div className={styles.otherInfo}>
          <IdBlock id={programId} size="medium" withIcon color="light" />
          <BulbBlock color="light" text={statusName} status={getBulbStatus(status)} />

          {'timestamp' in program && <TimestampBlock color="light" withIcon timestamp={program.timestamp} />}
        </div>
      </div>

      <div className={styles.actions}>
        {status === ProgramStatus.Active && (
          <>
            <ActionLink
              to={generatePath(absoluteRoutes.sendMessage, { programId })}
              icon={sendSVG}
              text="Send Message"
            />

            <IssueVoucher programId={programId} buttonColor="transparent" buttonSize="small" />
          </>
        )}
      </div>
    </article>
  );
};

export { ProgramCard };
