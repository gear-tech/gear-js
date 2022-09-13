import SimpleBar from 'simplebar-react';
import clsx from 'clsx';
import { inputStyles, inputWrapperStyles } from '@gear-js/ui';

import styles from '../Form.module.scss';

type Props = {
  text: string;
  label: string;
  isTextarea?: boolean;
};

const FormText = ({ text, label, isTextarea = false }: Props) => {
  const wrapperClasses = clsx(inputStyles.wrapper, inputStyles.normal, inputStyles.dark, inputStyles.readOnly);

  return (
    <div className={clsx(inputWrapperStyles.wrapper, inputWrapperStyles.y)}>
      <span className={styles.text}>{label}</span>
      <div className={wrapperClasses}>
        {isTextarea ? (
          <SimpleBar className={styles.fixedSizes}>
            <pre className={styles.preformatted}>{text}</pre>
          </SimpleBar>
        ) : (
          <pre className={styles.preformatted}>{text}</pre>
        )}
      </div>
    </div>
  );
};

export { FormText };
