import { memo } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';

import { AnimationTimeout } from '@/shared/config';
import { getShortName, formatDate } from '@/shared/helpers';
import TimestampSVG from '@/shared/assets/images/indicators/time.svg?react';

import styles from './Header.module.scss';

type Props = {
  exitCode?: number | null;
  messageId: string;
  timestamp?: string;
};

const Header = memo(({ exitCode, messageId, timestamp }: Props) => {
  const idSideClasses = clsx(styles.idSide, exitCode !== undefined && (exitCode ? styles.error : styles.success));

  return (
    <header className={styles.header}>
      <div className={idSideClasses}>
        <h1 className={styles.title}>{getShortName(messageId)}</h1>
      </div>
      {timestamp && (
        <CSSTransition in appear timeout={AnimationTimeout.Default}>
          <div className={styles.timestampSide}>
            <TimestampSVG />
            <span>Timestamp:</span>
            <span className={styles.value}>{formatDate(timestamp)}</span>
          </div>
        </CSSTransition>
      )}
    </header>
  );
});

export { Header };
