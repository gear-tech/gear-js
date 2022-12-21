import clsx from 'clsx';
import { SVGType } from 'types';
import styles from './ActionButton.module.scss';

type Props = {
  onClick: () => void;
  SVG: SVGType;
  isActive: boolean;
  name: string;
};

function ActionButton({ SVG, isActive, name, onClick }: Props) {
  const className = clsx(styles.button, isActive && styles.active);
  const logoClassName = clsx(styles.logo, isActive && styles.active);

  return (
    <button type="button" className={className} onClick={onClick}>
      <span className={logoClassName}>
        <SVG />
      </span>
      {name}
    </button>
  );
}

export { ActionButton };
