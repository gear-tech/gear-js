import { FunctionComponent, SVGProps, ComponentPropsWithRef } from 'react';

import { LabelContainer, LabelContainerProps } from '../label-container';
import styles from './input.module.scss';

type Props = Omit<ComponentPropsWithRef<'input'>, 'id' | 'size'> &
  LabelContainerProps & {
    icon?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  };

const Input = ({ icon: Icon, className, label, error, type = 'text', size, block, ...attrs }: Props) => {
  return (
    <LabelContainer className={className} label={label} error={error} size={size} block={block}>
      {Icon && <Icon className={styles.icon} />}

      <input className={styles.input} type={type} aria-invalid={Boolean(error)} {...attrs} />
    </LabelContainer>
  );
};
export { Input };
export type { Props as InputProps };
