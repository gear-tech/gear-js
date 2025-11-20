import { ButtonProps, buttonStyles } from '@gear-js/ui';

import { cx } from '@/utils';

function GearButton({
  size = 'medium',
  color = 'primary',
  block,
  noLetterSpacing,
  className,
  onClick,
  ...props
}: Omit<ButtonProps, 'icon'>) {
  return (
    <button
      type="button"
      className={cx(
        buttonStyles.button,
        buttonStyles.noWrap,
        buttonStyles[size],
        buttonStyles[color],
        !noLetterSpacing && buttonStyles.letterSpacing,
        block && buttonStyles.block,
        className,
      )}
      onClick={onClick}
      {...props}
    />
  );
}

export { GearButton };
