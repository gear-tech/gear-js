import { PropsWithClassName } from '@/shared/types';
import { cx } from '@/shared/utils';

import { ButtonProps, buttonStyles } from '../button';

import styles from './link-button.module.scss';

type Props = Pick<ButtonProps, 'variant' | 'size' | 'children'> &
  PropsWithClassName & {
    href: string;
  };

const LinkButton = ({ variant = 'default', size = 'default', children, href, className }: Props) => {
  return (
    <a
      href={href}
      className={cx(
        styles.link,
        buttonStyles.button,
        buttonStyles[`btn--variant-${variant}`],
        buttonStyles[`size-${size}`],
        className,
      )}
      target="_blank"
      rel="noreferrer">
      {children}
    </a>
  );
};

export { LinkButton };
