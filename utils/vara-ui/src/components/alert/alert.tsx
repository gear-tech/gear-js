import { CSSProperties, ReactNode } from 'react';
import cx from 'clsx';
import CrossSVG from '../../assets/images/cross.svg?react';
import { Button } from '../button';
import styles from './alert.module.scss';

type Options = {
  type: 'info' | 'error' | 'loading' | 'success';
  variant?: 'alert' | 'notification';
  style?: CSSProperties;
  title?: string;
  timeout?: number;
  isClosed?: boolean;
};

type AlertType = {
  id: string;
  content: ReactNode;
  footer?: ReactNode;
  options: Options;
};

type Props = {
  alert: AlertType;
  close: () => void;
};

function Alert({ alert, close }: Props) {
  const { content, options, footer } = alert;
  const { type, title, style, isClosed, variant } = options;
  const isNotification = variant === 'notification';

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
