import { CSSProperties, ReactNode } from 'react';
import cx from 'clsx';
import { Button } from '../button';
import styles from './alert.module.scss';
import CrossSVG from '../../assets/images/cross.svg?react';
import SuccessIcon from '../../assets/images/success.svg?react';
import ErrorIcon from '../../assets/images/error.svg?react';
import InfoIcon from '../../assets/images/info.svg?react';
import WarningIcon from '../../assets/images/warning.svg?react';
import LoadingIcon from '../../assets/images/loading.svg?react';

type Options = {
  type: 'info' | 'error' | 'loading' | 'success' | 'notification-high' | 'notification-low';
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

const Icons: Record<Options['type'], JSX.Element> = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  info: <InfoIcon />,
  loading: <LoadingIcon />,
  'notification-low': <WarningIcon />,
  'notification-high': <WarningIcon />,
};

function Alert({ alert, close }: Props) {
  const { content, options } = alert;
  const { type, title, style, isClosed, footer } = options;
  const isNotification = type.startsWith('notification');

  return (
    <div className={cx(styles.alert, isNotification && styles.notification, styles[type])} style={style}>
      <header className={cx(styles.header)}>
        {type && <div className={styles.icon}>{Icons[type]}</div>}
        {title || type}

        {isClosed && <Button icon={CrossSVG} color="transparent" className={styles.close} onClick={close} />}
      </header>

      <div className={styles.body}>{content}</div>

      {footer && <p className={styles.footer}>{footer}</p>}
    </div>
  );
}

export { Alert };
export type { Props as AlertProps };
