import { ReactNode, useEffect } from 'react';
import { FormikProps, Form } from 'formik';
import { CSSTransition } from 'react-transition-group';
import isEqual from 'lodash.isequal';
import { Button } from '@gear-js/ui';

import { usePrevious } from 'hooks';
import { AnimationTimeout } from 'shared/config';

import styles from './FiltersForm.module.scss';

type Props<T> = FormikProps<T> & {
  children: ReactNode;
};

const FiltersForm = <T,>(props: Props<T>) => {
  const { children, values, initialValues, submitForm, handleSubmit, handleReset } = props;

  const prevValues = usePrevious(values);

  useEffect(
    () => {
      if (values && prevValues && !isEqual(values, prevValues)) {
        submitForm();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values, prevValues],
  );

  const isDirty = !isEqual(values, initialValues);

  return (
    <Form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
      <div className={styles.header}>
        <h1 className={styles.title}>Filters</h1>
        <CSSTransition in={isDirty} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
          <Button type="reset" text="Clear all" color="transparent" className={styles.clearAllBtn} />
        </CSSTransition>
      </div>
      <div className={styles.mainFilters}>{children}</div>
    </Form>
  );
};

export { FiltersForm };
