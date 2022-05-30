import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { AlertTemplateProps, AlertType } from 'react-alert';
import xSVG from 'assets/images/alert/x.svg';
import styles from './Alert.module.scss';

function Alert({ message, options, style, close }: AlertTemplateProps) {
  const { type } = options;
  const headerClassName = clsx(styles.header, styles[type as AlertType]);

  return (
    <div className={styles.alert} style={style}>
      <header className={headerClassName}>
        {type}
        <Button icon={xSVG} color="transparent" className={styles.button} onClick={close} />
      </header>
      <div className={styles.body}>{message}</div>
    </div>
  );
}

export default Alert;
