import { Button } from '@gear-js/ui';
import type { ReactNode } from 'react';
import { type DefaultValues, type FieldValues, FormProvider, useForm } from 'react-hook-form';

import { AnimationTimeout } from '@/shared/config';
import { CSSTransitionWithRef } from '@/shared/ui';

import styles from './Filters.module.scss';

type Props<T> = {
  initialValues: DefaultValues<T>;
  onSubmit: (values: T) => void;
  children: ReactNode;
  values?: T;
  title?: string;
};

const Filters = <T extends FieldValues>({ initialValues, values, children, onSubmit, title = 'Filters' }: Props<T>) => {
  const methods = useForm({ defaultValues: initialValues, values, resetOptions: { keepDefaultValues: true } });
  const { handleSubmit, reset, formState } = methods;
  const { isDirty } = formState;

  const handleResetClick = () => {
    reset();
    handleSubmit(onSubmit)();
  };

  return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>

          <CSSTransitionWithRef in={isDirty} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
            <Button text="Clear all" color="transparent" className={styles.clearAllBtn} onClick={handleResetClick} />
          </CSSTransitionWithRef>
        </div>

        <div className={styles.mainFilters}>{children}</div>
      </form>
    </FormProvider>
  );
};

export { Filters };
