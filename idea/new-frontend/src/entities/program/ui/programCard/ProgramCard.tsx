import { memo, MouseEvent } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { absoluteRoutes, AnimationTimeout } from 'shared/config';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import { ProgramActionLink } from 'shared/ui/programActionLink';
import readSVG from 'shared/assets/images/actions/read.svg';
import sendSVG from 'shared/assets/images/actions/send.svg';

import styles from './ProgramCard.module.scss';
import { getBulbStatus } from '../../helpers';
import { IProgram } from '../../model/types';

type Props = {
  program: IProgram;
  withSendMessage: boolean;
};

const ProgramCard = memo(({ program, withSendMessage }: Props) => {
  const { id: programId, name, initStatus, timestamp } = program;

  const stopPropagation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return (
    <article className={styles.programCard}>
      <div className={styles.cardContent}>
        <h1 className={styles.title}>Program name</h1>
        <h2 className={styles.name}>{name}</h2>
        <IdBlock id={programId} size="small" color="light" withIcon className={styles.idBlock} />
        <div className={styles.otherInfo}>
          <BulbBlock text={initStatus} color="light" status={getBulbStatus(initStatus)} className={styles.bulbBlock} />
          <TimestampBlock color="light" withIcon timestamp={timestamp} />
        </div>
      </div>
      <div className={styles.actions}>
        <CSSTransition in={withSendMessage} exit={false} timeout={AnimationTimeout.Medium} mountOnEnter unmountOnExit>
          <ProgramActionLink
            to="/"
            icon={sendSVG}
            text="Send Message"
            className={styles.sendMessage}
            onClick={stopPropagation}
          />
        </CSSTransition>
        <ProgramActionLink to="/" icon={readSVG} text="Read State" onClick={stopPropagation} />
      </div>
      <Link to={generatePath(absoluteRoutes.program, { programId })} className={styles.cardLink} />
    </article>
  );
});

export { ProgramCard };
