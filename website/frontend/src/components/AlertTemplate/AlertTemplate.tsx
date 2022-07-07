import { useMemo } from 'react';
import clsx from 'clsx';
import { AlertTemplateProps } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './AlertTemplate.module.scss';

import closeSVG from 'assets/images/close.svg';

const AlertTemplate = ({ alert, onClose }: AlertTemplateProps) => {
  const { type, title, style, isClosed } = alert.options;

  const currentDate = useMemo(
    () => new Date(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, alert.content]
  );

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
