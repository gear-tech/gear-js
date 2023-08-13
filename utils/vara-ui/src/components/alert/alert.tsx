import { CSSProperties, ReactNode } from 'react';
import cx from 'clsx';
import { ReactComponent as CrossSVG } from '../../assets/images/cross.svg';
import { Button } from '../button';
import styles from './alert.module.css';

type Options = {
  type: 'info' | 'error' | 'loading' | 'success';
  style?: CSSProperties;
  title?: string;
  timeout?: number;
  isClosed?: boolean;
};

type AlertType = {
  id: string;
  content: ReactNode;
  options: Options;
};

type Props = {
  alert: AlertType;
  close: () => void;
};

function Alert({ alert, close }: Props) {
  const { content, options } = alert;
  const { type, title, style, isClosed } = options;

  return (
    <div className={styles.alert} style={style}>
      <header className={cx(styles.header, styles[type])}>
        {title || type}

        {isClosed && <Button icon={CrossSVG} color="transparent" className={styles.button} onClick={close} />}
      </header>

      <div className={styles.body}>{content}</div>
    </div>
  );
}

export { Alert };
export type { Props as AlertProps };
