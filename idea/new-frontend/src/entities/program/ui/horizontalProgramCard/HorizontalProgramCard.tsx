import { memo } from 'react';
import { CSSTransition } from 'react-transition-group';
import { TooltipWrapper } from '@gear-js/ui';

import { AnimationTimeout } from 'shared/config';
import sendSVG from 'shared/assets/images/actions/send.svg';
import readSVG from 'shared/assets/images/actions/read.svg';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { Indicator } from 'shared/ui/indicator';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import { ProgramActionLink } from 'shared/ui/programActionLink';

import styles from './HorizontalProgramCard.module.scss';
import { getBulbStatus } from '../../helpers';
import { IProgram } from '../../model/types';

type Props = {
  program: IProgram;
  withSendMessage: boolean;
};

const HorizontalProgramCard = memo(({ program, withSendMessage }: Props) => {
  const { id, name, initStatus, timestamp } = program;

  return (
    <article className={styles.horizontalProgramCard}>
      <div className={styles.content}>
        <div className={styles.programName}>
          <h1 className={styles.name}>{name}</h1>
          <TooltipWrapper text="Messages waiting your attention" className={styles.tooltip}>
            <Indicator value={25} />
          </TooltipWrapper>
        </div>
        <div className={styles.otherInfo}>
          <IdBlock id={id} />
          <BulbBlock text={initStatus} status={getBulbStatus(initStatus)} />
          <TimestampBlock timestamp={timestamp} />
        </div>
      </div>
      <div className={styles.actions}>
        <CSSTransition in={withSendMessage} exit={false} timeout={AnimationTimeout.Medium} unmountOnExit>
          <ProgramActionLink to="/" icon={sendSVG} text="Send Message" className={styles.sendMessage} />
        </CSSTransition>
        <ProgramActionLink to="/" icon={readSVG} text="Read State" />
      </div>
    </article>
  );
});

export { HorizontalProgramCard };
