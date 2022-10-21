import { MouseEvent } from 'react';
import clsx from 'clsx';
import { useAlert } from '@gear-js/react-hooks';
import { buttonStyles } from '@gear-js/ui';
import { generatePath, Link } from 'react-router-dom';

import { absoluteRoutes } from 'shared/config';

import { getShortName, copyToClipboard } from '../../helpers';
import { ReactComponent as CopySVG } from '../../assets/images/actions/copyGreen.svg';
import idSVG from '../../assets/images/indicators/id.svg';
import styles from './IdBlock.module.scss';

type Props = {
  id: string;
  size?: 'small' | 'medium' | 'big' | 'large';
  color?: 'light' | 'primary';
  withIcon?: boolean;
  maxCharts?: number;
  className?: string;
};

const IdBlock = (props: Props) => {
  const { id, size = 'medium', color = 'primary', withIcon = false, maxCharts, className } = props;

  const alert = useAlert();

  const handleCopy = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    copyToClipboard(id, alert);
  };

  const buttonClasses = clsx(buttonStyles.button, buttonStyles.noText, buttonStyles.transparent, styles.copyBtn);

  return (
    <div className={clsx(styles.idBlock, styles[size], className)}>
      {withIcon && <img src={idSVG} alt="id" className={styles.icon} />}
      <Link to={generatePath(absoluteRoutes.message, { messageId: id })} className={clsx(styles.value, styles[color])}>
        {getShortName(id, maxCharts)}
      </Link>
      <button type="button" className={buttonClasses} onClick={handleCopy}>
        <CopySVG className={clsx(buttonStyles.icon, styles.copyIcon)} />
      </button>
    </div>
  );
};

export { IdBlock };
