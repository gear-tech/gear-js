import clsx from 'clsx';
import { Button } from '../Button/Button';
import xSVG from './images/x.svg?react';
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

// TODO: either fix only-export-components or remove rule
// eslint-disable-next-line react-refresh/only-export-components
export { Alert, styles as alertStyles };
export type { Props as AlertProps };
