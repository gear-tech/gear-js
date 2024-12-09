import { CSSProperties, ReactNode } from 'react';
import cx from 'clsx';
import styles from './alert.module.scss';
import CrossSVG from '../../assets/images/cross.svg?react';
import { alertIcons } from './icons.tsx';

type AlertVariants = 'alert' | 'notification';
type AlertTypes = 'info' | 'error' | 'loading' | 'success';

type Options = {
  type: AlertTypes;
  variant?: AlertVariants;
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
  const { variant = 'alert', type = 'info', title, style, isClosed } = options;

  return (
    <div className={cx(styles.wrapper, styles[variant], styles[type])} style={style}>
      <header className={cx(styles.header)}>
        {type && <div className={styles.icon}>{alertIcons[variant][type]}</div>}

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
export type { Props as AlertProps, AlertVariants, AlertTypes };
