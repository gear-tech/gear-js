import { Button } from '@gear-js/ui';
import { ReactNode } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';

import { AnimationTimeout } from '@/shared/config';

import styles from './FilterGroup.module.scss';

type Props<T> = {
  name: Path<T>;
  children: ReactNode;
  onSubmit: (values: T) => void;
  title?: string;
  withReset?: boolean;
};

const FilterGroup = <T extends FieldValues>({ name, title, withReset = false, onSubmit, children }: Props<T>) => {
  const { resetField, handleSubmit, getFieldState } = useFormContext<T>();
  const { isDirty } = getFieldState(name);

  const handleFilterReset = () => {
    resetField(name);
    handleSubmit(onSubmit)();
  };

  return (
    <div className={styles.filterGroup}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>

          <CSSTransition in={withReset ? isDirty : false} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
            <Button text="Clear" color="transparent" className={styles.clearBtn} onClick={handleFilterReset} />
          </CSSTransition>
        </div>
      )}

      {children}
    </div>
  );
};

export { FilterGroup };
