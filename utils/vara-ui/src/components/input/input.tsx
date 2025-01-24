import { InputHTMLAttributes, forwardRef, FunctionComponent, SVGProps } from 'react';

import { LabelContainer, LabelContainerProps } from '../label-container';
import styles from './input.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'size'> &
  LabelContainerProps & {
    icon?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  };

const Input = forwardRef<HTMLInputElement, Props>(
  ({ icon: Icon, className, label, error, type = 'text', size, block, ...attrs }, ref) => {
    return (
      <LabelContainer className={className} label={label} error={error} size={size} block={block}>
        {Icon && <Icon className={styles.icon} />}

        <input className={styles.input} type={type} ref={ref} aria-invalid={Boolean(error)} {...attrs} />
      </LabelContainer>
    );
  },
);

export { Input };
export type { Props as InputProps };
