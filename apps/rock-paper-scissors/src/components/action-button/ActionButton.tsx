import clsx from 'clsx';
import { SVGType } from 'types';
import styles from './ActionButton.module.scss';

type Props = {
  onClick: (attr: string) => void;
  SVG?: SVGType;
  isActive: boolean;
  name: string;
};

function ActionButton({ SVG, isActive, name, onClick }: Props) {
  const className = clsx(styles.button, isActive && styles.active);
  const logoClassName = clsx(styles.logo, isActive && styles.active);

  return (
    <button type="button" className={className} onClick={() => onClick(name)}>
      <span className={logoClassName}>
        {SVG && <SVG />}
      </span>
      {name}
    </button>
  );
}

export { ActionButton };
