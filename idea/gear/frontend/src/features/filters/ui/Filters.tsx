import { Button } from '@gear-js/ui';
import { ReactNode } from 'react';
import { useForm, FormProvider, FieldValues, DefaultValues } from 'react-hook-form';

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
  const methods = useForm<T>({ defaultValues: initialValues, values, resetOptions: { keepDefaultValues: true } });
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
