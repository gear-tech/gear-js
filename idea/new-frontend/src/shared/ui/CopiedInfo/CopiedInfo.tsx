import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui/dist/esm';

import { copyToClipboard } from 'shared/helpers';
import copySVG from 'shared/assets/images/actions/copy.svg';

import styles from './CopiedInfo.module.scss';

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
