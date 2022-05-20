import clsx from 'clsx';
import { Button } from '@gear-js/ui';

import styles from './AlertTemplate.module.scss';

import closeSVG from 'assets/images/close.svg';
import { AlertTemplateProps } from 'context/alert/types';

const AlertTemplate = ({ alert, onClose }: AlertTemplateProps) => {
  const { type, title, style, isClosed } = alert.options;

  const currentDate = new Date();

  return (
    <div className={styles.alert} style={style}>
      {isClosed && <Button icon={closeSVG} color="transparent" className={styles.closeBtn} onClick={onClose} />}
      <header className={clsx(styles.header, styles[type || ''])}>{title || type}</header>
      <div className={styles.body}>{alert.content}</div>
      <footer className={styles.footer}>
        {currentDate.toLocaleDateString()} / {currentDate.toLocaleTimeString()}
      </footer>
    </div>
  );
};

export { AlertTemplate };
