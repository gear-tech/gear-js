import { OptionHTMLAttributes, useMemo, ComponentPropsWithRef } from 'react';

import { LabelContainer, LabelContainerProps } from '../label-container';

import styles from './select.module.scss';

type Props = Omit<ComponentPropsWithRef<'select'>, 'id' | 'size'> &
  LabelContainerProps & {
    options: OptionHTMLAttributes<HTMLOptionElement>[] | Readonly<OptionHTMLAttributes<HTMLOptionElement>[]>;
  };

const Select = ({ options, className, label, error, size, block, ...attrs }: Props) => {
  const optionsToRender = useMemo(() => options.map((option, index) => <option key={index} {...option} />), [options]);

  return (
    <LabelContainer className={className} label={label} error={error} size={size} block={block}>
      <select className={styles.select} aria-invalid={Boolean(error)} {...attrs}>
        {optionsToRender}
      </select>
    </LabelContainer>
  );
};

export { Select };
export type { Props as SelectProps };
