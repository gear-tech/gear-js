import { Button } from '@gear-js/ui';
import { ReactNode } from 'react';
import { useForm, FormProvider, FieldValues, DefaultValues } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';

import { AnimationTimeout } from '@/shared/config';

import styles from './Filters.module.scss';

type Props<T> = {
  initialValues: DefaultValues<T>;
  onSubmit: (values: T) => void;
  children: ReactNode;
  title?: string;
};

const Filters = <T extends FieldValues>({ initialValues, children, onSubmit, title = 'Filters' }: Props<T>) => {
  const methods = useForm<T>({ defaultValues: initialValues });
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

          <CSSTransition in={isDirty} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
            <Button text="Clear all" color="transparent" className={styles.clearAllBtn} onClick={handleResetClick} />
          </CSSTransition>
        </div>

        <div className={styles.mainFilters}>{children}</div>
      </form>
    </FormProvider>
  );
};

export { Filters };
