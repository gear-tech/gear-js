import { Button as GearButton } from '@gear-js/ui';
import clsx from 'clsx';
import styles from './Button.module.scss';

type Props = {
  text: string;
  isActive: boolean;
  onClick: () => void;
};

function Button({ text, isActive, onClick }: Props) {
  const className = clsx(styles.button, isActive && styles.active);

  return <GearButton text={text} size="small" className={className} onClick={onClick} />;
}

export { Button };
