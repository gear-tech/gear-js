import type { ComponentPropsWithRef } from 'react';

import { LabelContainer, type LabelContainerProps } from '../label-container';

import styles from './textarea.module.scss';

type Props = Omit<ComponentPropsWithRef<'textarea'>, 'id' | 'size'> & LabelContainerProps;

const Textarea = ({ className, label, error, size, rows = 5, block, ...attrs }: Props) => {
  return (
    <LabelContainer className={className} label={label} error={error} size={size} block={block}>
      <textarea rows={rows} className={styles.textarea} aria-invalid={Boolean(error)} {...attrs} />
    </LabelContainer>
  );
};

export type { Props as TextareaProps };
export { Textarea };
