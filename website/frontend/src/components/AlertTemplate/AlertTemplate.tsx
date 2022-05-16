import clsx from 'clsx';
import { Button } from '@gear-js/ui';

import styles from './AlertTemplate.module.scss';

import closeSVG from 'assets/images/close.svg';
import { AlertInstance } from 'context/alert/types';

const AlertTemplate = ({ message, options, style, close }: AlertInstance) => {
  const { type, closed } = options;
  const currentDate = new Date();

  return (
    <div className={styles.alert} style={style}>
      {closed && <Button icon={closeSVG} color="transparent" className={styles.closeBtn} onClick={close} />}
      <header className={clsx(styles.header, styles[type || ''])}>{type}</header>
      <div className={styles.body}>{message}</div>
      <footer className={styles.footer}>
        {currentDate.toLocaleDateString()} / {currentDate.toLocaleTimeString()}
      </footer>
    </div>
  );
};

export { AlertTemplate };
