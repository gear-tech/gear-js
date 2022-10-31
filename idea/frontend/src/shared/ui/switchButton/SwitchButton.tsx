import clsx from 'clsx';
import { ButtonProps, buttonStyles } from '@gear-js/ui';

import styles from './SwitchButton.module.scss';

type Props = Pick<ButtonProps, 'text' | 'className' | 'onClick'> & {
  isActive?: boolean;
};

const SwitchButton = ({ text, isActive = false, className, onClick }: Props) => {
  const buttonClasses = clsx(buttonStyles.button, styles.switchButton, isActive && styles.active, className);

  return (
    <button type="button" className={buttonClasses} onClick={onClick}>
      {text}
    </button>
  );
};

export { SwitchButton };
