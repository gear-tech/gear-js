import cx from 'clsx';
import { CSSProperties, ReactNode } from 'react';

import CrossSVG from '../../assets/images/cross.svg?react';
import { Button } from '../button';

import styles from './alert.module.scss';
import InfoSVG from './assets/info.svg?react';
import LoadingSVG from './assets/loading.svg?react';
import SuccessSVG from './assets/success.svg?react';
import WarningCircleSVG from './assets/warning-circle.svg?react';
import WarningSVG from './assets/warning.svg?react';

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
  options: Options;
  footer?: ReactNode;
};

type Props = {
  alert: AlertType;
  close: () => void;
};

const ICONS = {
  success: SuccessSVG,
  error: WarningSVG,
  info: InfoSVG,
  loading: LoadingSVG,
} as const;

function Alert({ alert, close }: Props) {
  const { content, options, footer } = alert;
  const { variant = 'alert', type, title, style, isClosed } = options;
  const SVG = variant === 'alert' || type === 'loading' ? ICONS[type] : WarningCircleSVG;

  return (
    <div className={cx(styles.container, styles[variant], styles[type])} style={style}>
      <header className={styles.header}>
        <SVG className={styles.icon} />
        <h2 className={styles.title}>{title || type}</h2>

        {isClosed && (
          <Button icon={CrossSVG} color="transparent" size="medium" className={styles.button} onClick={close} />
        )}
      </header>

      <div className={styles.body}>{content}</div>

      {footer && <p className={styles.footer}>{footer}</p>}
    </div>
  );
}

export { Alert };
export type { Props as AlertProps };
