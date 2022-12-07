import clsx from 'clsx';
import { SVGType } from 'types';
import styles from './ActionButton.module.scss';

type Props = {
  SVG: SVGType;
  isActive: boolean;
  name: string;
};

function ActionButton({ SVG, isActive, name }: Props) {
  const className = clsx(styles.button, isActive && styles.active);
  const logoClassName = clsx(styles.logo, isActive && styles.active);

  return (
    <button type="button" className={className}>
      <span className={logoClassName}>
        <SVG />
      </span>
      {name}
    </button>
  );
}

export { ActionButton };
