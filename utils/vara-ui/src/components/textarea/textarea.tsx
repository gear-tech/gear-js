import { TextareaHTMLAttributes, forwardRef } from 'react';

import { LabelContainer, LabelContainerProps } from '../label-container';
import styles from './textarea.module.scss';

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'size'> & LabelContainerProps;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, label, error, size, rows = 5, block, ...attrs }, ref) => {
    return (
      <LabelContainer className={className} label={label} error={error} size={size} block={block}>
        <textarea rows={rows} className={styles.textarea} ref={ref} aria-invalid={Boolean(error)} {...attrs} />
      </LabelContainer>
    );
  },
);

export { Textarea };
export type { Props as TextareaProps };
