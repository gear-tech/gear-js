import SimpleBar from 'simplebar-react';
import clsx from 'clsx';
import { inputStyles, inputWrapperStyles, InputProps } from '@gear-js/ui';

import styles from '../Form.module.scss';

type Props = Pick<InputProps, 'label' | 'direction' | 'className'> & {
  text?: string;
  isLoading?: boolean;
  isTextarea?: boolean;
};

const FormText = ({ text, label, className, direction = 'x', isLoading = false, isTextarea = false }: Props) => {
  const wrapperClasses = clsx(inputWrapperStyles.wrapper, inputWrapperStyles[direction], className);

  const fieldWrapperClasses = clsx(
    inputStyles.wrapper,
    inputStyles.normal,
    inputStyles.dark,
    inputStyles.readOnly,
    inputStyles.block,
    styles.textContent,
    isTextarea && styles.fixedSizes,
    isLoading && styles.loading,
  );

  return (
    <div className={wrapperClasses}>
      <div className={clsx(inputWrapperStyles.labelWrapper, inputWrapperStyles.normal, inputWrapperStyles[direction])}>
        <span className={inputWrapperStyles.label}>{label}</span>
      </div>
      <div className={fieldWrapperClasses}>
        {!isLoading &&
          (isTextarea ? (
            <SimpleBar className={styles.simpleBar}>
              <pre className={styles.preformatted}>{text}</pre>
            </SimpleBar>
          ) : (
            <span className={styles.preformatted}>{text}</span>
          ))}
      </div>
    </div>
  );
};

export { FormText };
