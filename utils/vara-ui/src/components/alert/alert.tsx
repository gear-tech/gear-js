import { CSSProperties, ReactNode } from 'react';
import cx from 'clsx';
import CrossSVG from '../../assets/images/cross.svg?react';
import { Button } from '../button';
import styles from './alert.module.scss';

type Options = {
  type: 'info' | 'error' | 'loading' | 'success' | 'notification-warning' | 'notification-info';
  style?: CSSProperties;
  title?: string;
  footer?: string;
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
  const { type, title, style, isClosed, footer } = options;
  const isNotification = type.startsWith('notification');

  return (
    <div className={cx(styles.alert, isNotification && styles.notification)} style={style}>
      <header className={cx(styles.header, styles[type])}>
        {title || type}

        {isClosed && <Button icon={CrossSVG} color="transparent" className={styles.button} onClick={close} />}
      </header>

      <div className={styles.body}>{content}</div>

      {footer && <p className={styles.footer}>{footer}</p>}
    </div>
  );
}

export { Alert };
export type { Props as AlertProps };
