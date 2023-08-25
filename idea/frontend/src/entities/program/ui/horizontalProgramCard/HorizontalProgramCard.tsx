import { memo } from 'react';
import { Link, generatePath } from 'react-router-dom';
import cx from 'clsx';

import { useIsVoucherExists, CreateVoucher } from 'features/voucher';
import { absoluteRoutes, routes } from 'shared/config';
import { ReactComponent as sendSVG } from 'shared/assets/images/actions/send.svg';
import { ReactComponent as readSVG } from 'shared/assets/images/actions/read.svg';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import { ActionLink } from 'shared/ui/ActionLink';

import { getBulbStatus } from '../../helpers';
import { IProgram, PROGRAM_STATUS_NAME, ProgramStatus } from '../../model';
import styles from './HorizontalProgramCard.module.scss';

type Props = {
  program: IProgram;
};

const HorizontalProgramCard = memo(({ program }: Props) => {
  const { id: programId, name, status, timestamp, hasState } = program;
  const statusName = PROGRAM_STATUS_NAME[status];

  const { isVoucherExists } = useIsVoucherExists(programId);

  return (
    <article className={cx(styles.horizontalProgramCard, isVoucherExists && styles.voucher)}>
      <div className={styles.content}>
        <Link to={generatePath(absoluteRoutes.program, { programId })} className={styles.link}>
          <h2 className={styles.name}>{name}</h2>
        </Link>
        <div className={styles.otherInfo}>
          <IdBlock id={programId} size="medium" withIcon color="light" />
          <BulbBlock color="light" text={statusName} status={getBulbStatus(status)} />
          <TimestampBlock color="light" withIcon timestamp={timestamp} />
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

            {hasState && <ActionLink to={generatePath(routes.state, { programId })} icon={readSVG} text="Read State" />}

            <CreateVoucher programId={programId} />
          </>
        )}
      </div>
    </article>
  );
});

export { HorizontalProgramCard };
