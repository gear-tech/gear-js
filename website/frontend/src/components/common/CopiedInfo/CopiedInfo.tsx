import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './CopiedInfo.module.scss';

import { copyToClipboard } from 'helpers';
import copySVG from 'assets/images/copy.svg';

type Props = {
  info: string;
  title?: string;
};

const CopiedInfo = ({ title, info }: Props) => {
  const alert = useAlert();

  const handleClick = () => copyToClipboard(info, alert);

  return (
    <div>
      <p>{title}:</p>
      <p className={styles.info}>{info}</p>
      <Button icon={copySVG} color="transparent" className={styles.copyButton} onClick={handleClick} />
    </div>
  );
};

export { CopiedInfo };
