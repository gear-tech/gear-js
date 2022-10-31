import { ReactNode } from 'react';
import { Form, FormProps } from 'react-final-form';

import styles from './Filters.module.scss';
import { FilterHeader } from './filterHeader';

type Props<T> = FormProps<T> & {
  children: ReactNode;
};

const Filters = <T,>({ children, ...formProps }: Props<T>) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Form {...formProps}>
    {({ handleSubmit }) => (
      <form className={styles.form} onSubmit={handleSubmit}>
        <FilterHeader />
        <div className={styles.mainFilters}>{children}</div>
      </form>
    )}
  </Form>
);

export { Filters };
