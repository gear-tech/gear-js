import type { IconProps } from '.';

export const Icon = ({ name, className, section = 'icons', ...props }: IconProps) => {
  return (
    <svg className={className} {...props}>
      <use href={`/sprites/${section}.svg?sprite#${name}`} />
    </svg>
  );
};
