import { memo, MouseEvent } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Metadata } from '@gear-js/api';

import { absoluteRoutes, AnimationTimeout, routes } from 'shared/config';
import sendSVG from 'shared/assets/images/actions/send.svg';
import readSVG from 'shared/assets/images/actions/read.svg';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import { ActionLink } from 'shared/ui/ActionLink';
import { isState } from 'shared/helpers';

import styles from './HorizontalProgramCard.module.scss';
import { getBulbStatus } from '../../helpers';
import { IProgram, PROGRAM_STATUS_NAME } from '../../model';

type Props = {
  program: IProgram;
  withSendMessage: boolean;
};

const HorizontalProgramCard = memo(({ program, withSendMessage }: Props) => {
  const { id: programId, name, status, timestamp } = program;

  const stopPropagation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  const statusName = PROGRAM_STATUS_NAME[status];

  const metaString = program.meta?.meta;
  const meta = metaString ? (JSON.parse(metaString) as Metadata) : undefined;

  return (
    <article className={styles.horizontalProgramCard}>
      <div className={styles.content}>
        <h1 className={styles.name}>{name}</h1>
        <div className={styles.otherInfo}>
          <IdBlock id={programId} size="medium" withIcon color="light" />
          <BulbBlock color="light" text={statusName} status={getBulbStatus(status)} />
          <TimestampBlock color="light" withIcon timestamp={timestamp} />
        </div>
      </div>
      <div className={styles.actions}>
        <CSSTransition in={withSendMessage} exit={false} timeout={AnimationTimeout.Medium} unmountOnExit>
          <ActionLink
            to={generatePath(absoluteRoutes.sendMessage, { programId })}
            icon={sendSVG}
            text="Send Message"
            className={styles.sendMessage}
            onClick={stopPropagation}
          />
        </CSSTransition>
        {isState(meta) && (
          <ActionLink
            to={generatePath(routes.state, { programId })}
            icon={readSVG}
            text="Read State"
            onClick={stopPropagation}
          />
        )}
      </div>
      <Link to={generatePath(absoluteRoutes.program, { programId })} className={styles.cardLink} />
    </article>
  );
});

export { HorizontalProgramCard };
