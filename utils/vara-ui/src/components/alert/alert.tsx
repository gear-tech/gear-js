import { CSSProperties, ReactNode } from 'react';
import cx from 'clsx';
import styles from './alert.module.scss';
import CrossSVG from '../../assets/images/cross.svg?react';
import { alertIcons } from './icons.tsx';

type IAlertVariants = 'alert' | 'notification';
type IAlertTypes = 'info' | 'error' | 'loading' | 'success';
type IAlertIcons = Record<IAlertVariants, Record<IAlertTypes, ReactNode>>;

type Options = {
  type: IAlertTypes;
  variant?: IAlertVariants;
  style?: CSSProperties;
  title?: string;
  timeout?: number;
  isClosed?: boolean;
  icons?: IAlertIcons;
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
  const { variant = 'alert', type = 'info', title, style, isClosed, icons = alertIcons } = options;

  return (
    <div className={cx(styles.wrapper, styles[variant], styles[type])} style={style}>
      <header className={cx(styles.header)}>
        {type && <div className={styles.icon}>{icons[variant][type]}</div>}

        <h2 className={styles.title}>{title || type}</h2>

        {isClosed && (
          <button type="button" className={styles.close} onClick={close}>
            <CrossSVG />
          </button>
        )}
      </header>

      <div className={styles.body}>{content}</div>

      {footer && <p className={styles.footer}>{footer}</p>}
    </div>
  );
}

export { Alert };
export type { Props as AlertProps, IAlertVariants, IAlertTypes, IAlertIcons };
