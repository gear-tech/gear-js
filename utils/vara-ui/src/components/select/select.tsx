import { SelectHTMLAttributes, OptionHTMLAttributes, forwardRef, useMemo } from 'react';

import { LabelContainer, LabelContainerProps } from '../label-container';
import styles from './select.module.scss';

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'size'> &
  LabelContainerProps & {
    options: OptionHTMLAttributes<HTMLOptionElement>[] | Readonly<OptionHTMLAttributes<HTMLOptionElement>[]>;
  };

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ options, className, label, error, size, block, ...attrs }, ref) => {
    const optionsToRender = useMemo(
      () => options.map((option, index) => <option key={index} {...option} />),
      [options],
    );

    return (
      <LabelContainer className={className} label={label} error={error} size={size} block={block}>
        <select className={styles.select} ref={ref} aria-invalid={Boolean(error)} {...attrs}>
          {optionsToRender}
        </select>
      </LabelContainer>
    );
  },
);

export { Select };
export type { Props as SelectProps };
