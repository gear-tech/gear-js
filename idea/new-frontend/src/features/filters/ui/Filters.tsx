import { ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';

import { Radio } from './radio';
import { FiltersForm } from './filtersForm';
import { FilterGroup } from './filterGroup';
import { StatusCheckbox } from './statusCheckbox';

type Props<T> = Pick<FormikProps<T>, 'enableReinitialize' | 'initialValues'> & {
  children: ReactNode;
  onSubmit: (values: T) => void;
};

const Filters = <T,>({ children, initialValues, enableReinitialize, onSubmit }: Props<T>) => (
  /* @ts-ignore */
  <Formik initialValues={initialValues} enableReinitialize={enableReinitialize} onSubmit={onSubmit}>
    {(props) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <FiltersForm {...props}>{children}</FiltersForm>
    )}
  </Formik>
);

Filters.Radio = Radio;
Filters.Group = FilterGroup;
Filters.StatusCheckbox = StatusCheckbox;

export { Filters };
