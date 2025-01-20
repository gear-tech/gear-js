import { Link, LinkProps } from 'react-router-dom';
import clsx from 'clsx';
import { ButtonProps, buttonStyles } from '@gear-js/ui';

type Props = LinkProps & ButtonProps;

const UILink = (props: Props) => {
  const { icon: Icon, size, text, color, className, children, ...otherProps } = props;

  const linkClasses = clsx(
    buttonStyles.button,
    size ? buttonStyles[size] : buttonStyles.medium,
    color ? buttonStyles[color] : buttonStyles.primary,
    !text && buttonStyles.noText,
    className,
  );

  return (
     
    <Link {...otherProps} className={linkClasses}>
      {Icon && <Icon className={buttonStyles.icon} />}
      {text}
      {children}
    </Link>
  );
};

export { UILink };
