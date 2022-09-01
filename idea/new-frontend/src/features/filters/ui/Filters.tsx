import { ReactNode } from 'react';
import { Formik, FormikProps, Form } from 'formik';
import { CSSTransition } from 'react-transition-group';
import isEqual from 'lodash.isequal';
import { Input, Button } from '@gear-js/ui';

import { AnimationTimeout } from 'shared/config';

import styles from './Filters.module.scss';
import { FormValues } from '../model/types';
import { Radio } from './radio';
import { StatusCheckbox } from './statusCheckbox';
import { FilterGroup } from './filterGroup';

type Props<T> = Pick<FormikProps<T>, 'initialValues'> & {
  children: ReactNode;
  onSubmit: (values: T) => void;
  searchPlaceholder?: string;
};

const Filters = <T extends FormValues>({ children, initialValues, searchPlaceholder, onSubmit }: Props<T>) => (
  <Formik initialValues={initialValues} onSubmit={onSubmit}>
    {({ values }) => (
      <Form className={styles.filters}>
        <div className={styles.serchFieldWrapper}>
          <Input placeholder={searchPlaceholder} />
        </div>
        <div className={styles.filtersContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Filters</h1>
            <CSSTransition
              in={!isEqual(values, initialValues)}
              timeout={AnimationTimeout.Default}
              mountOnEnter
              unmountOnExit>
              <Button type="reset" text="Clear all" color="transparent" className={styles.clearAllBtn} />
            </CSSTransition>
          </div>
          <div className={styles.mainFilters}>{children}</div>
        </div>
      </Form>
    )}
  </Formik>
);

Filters.Radio = Radio;
Filters.FilterGroup = FilterGroup;
Filters.StatusCheckbox = StatusCheckbox;

export { Filters };
