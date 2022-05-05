import { AlertTemplateProps } from 'react-alert';
import clsx from 'clsx';
import { Button } from '@gear-js/ui';

import styles from './AlertTemplate.module.scss';

import closeSVG from 'assets/images/close.svg';

const AlertTemplate = ({ message, options, style, close }: AlertTemplateProps) => {
  const currentDate = new Date();

  return (
    <div className={styles.alert} style={style}>
      <Button icon={closeSVG} color="transparent" className={styles.closeBtn} onClick={close} />
      <div className={clsx(styles.header, styles[options.type || ''])}>{options.type}</div>
      <div className={styles.body}>{message}</div>
      <div className={styles.footer}>
        {currentDate.toLocaleDateString()} / {currentDate.toLocaleTimeString()}
      </div>
    </div>
  );
};

export { AlertTemplate };
