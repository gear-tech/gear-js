import clsx from 'clsx';
import { Button } from '../Button/Button';
import xSVG from './images/x.svg';
import { Props } from './Alert.types';
import styles from './Alert.module.scss';

function Alert({ alert, close }: Props) {
  const { content, options } = alert;
  const { type, title, style, isClosed } = options;
  const headerClassName = clsx(styles.header, styles[type]);

  return (
    <div className={styles.alert} style={style}>
      <header className={headerClassName}>
        {title || type}
        {isClosed && <Button icon={xSVG} color="transparent" className={styles.button} onClick={close} />}
      </header>
      <div className={styles.body}>{content}</div>
    </div>
  );
}

export { Alert, Props as AlertProps, styles as alertStyles };
