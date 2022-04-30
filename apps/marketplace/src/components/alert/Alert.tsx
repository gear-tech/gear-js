import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { AlertTemplateProps, AlertType } from 'react-alert';
import styles from './Alert.module.scss';

function Alert({ message, options, style, close }: AlertTemplateProps) {
  const { type } = options;
  const className = clsx(styles.alert, styles[type as AlertType]);

  return (
    <div style={style} className={className}>
      <span className={styles.text}>{message}</span>
      <Button text="x" color="transparent" size="small" onClick={close} />
    </div>
  );
}

export default Alert;
