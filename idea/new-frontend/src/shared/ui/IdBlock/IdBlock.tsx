import { MouseEvent } from 'react';
import clsx from 'clsx';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './IdBlock.module.scss';

import { getShortName, copyToClipboard } from '../../helpers';
import idSVG from '../../assets/images/indicators/id.svg';
import copyGreenSVG from '../../assets/images/actions/copyGreen.svg';

type Props = {
  id: string;
  className?: string;
};

const IdBlock = ({ id, className }: Props) => {
  const alert = useAlert();

  const handleCopy = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    copyToClipboard(id, alert);
  };

  return (
    <div className={clsx(styles.idBlock, className)}>
      <img src={idSVG} alt="id" className={styles.icon} />
      <span className={styles.value}>{getShortName(id)}</span>
      <Button icon={copyGreenSVG} size="small" color="transparent" className={styles.copyBtn} onClick={handleCopy} />
    </div>
  );
};

export { IdBlock };
