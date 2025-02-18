import { useAlert } from '@gear-js/react-hooks';
import { buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';
import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import CopySVG from '../../assets/images/actions/copyGreen.svg?react';
import IdSVG from '../../assets/images/indicators/id.svg?react';
import { getShortName, copyToClipboard } from '../../helpers';

import styles from './IdBlock.module.scss';

type Props = {
  id: string;
  size?: 'small' | 'medium' | 'big' | 'large';
  color?: 'light' | 'primary';
  withIcon?: boolean;
  maxCharts?: number;
  className?: string;
  to?: string;
};

const IdBlock = (props: Props) => {
  const { id, size = 'medium', color = 'primary', withIcon = false, maxCharts, className, to } = props;

  const alert = useAlert();

  const handleCopy = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    copyToClipboard(id, alert);
  };

  const buttonClasses = clsx(buttonStyles.button, buttonStyles.noText, buttonStyles.transparent, styles.copyBtn);

  const name = getShortName(id, maxCharts);
  const nameClassName = clsx(styles.value, styles[color]);
  const linkClassName = clsx(nameClassName, styles.link);

  return (
    <div className={clsx(styles.idBlock, styles[size], className)}>
      {withIcon && <IdSVG className={styles.icon} />}

      {to ? (
        <Link to={to} className={linkClassName}>
          {name}
        </Link>
      ) : (
        <span className={nameClassName}>{name}</span>
      )}

      <button type="button" className={buttonClasses} onClick={handleCopy}>
        <CopySVG className={clsx(buttonStyles.icon, styles.copyIcon)} />
      </button>
    </div>
  );
};

export { IdBlock };
