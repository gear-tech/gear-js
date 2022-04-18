import React from 'react';
import { Button } from '@gear-js/ui';
import { Field, Form, Formik } from 'formik';
import { SearchModel } from 'types/program';
import { InputBlock } from './children';
import searchIcon from 'assets/images/search.svg';
import { Schema } from './Schema';
import styles from './SearchForm.module.scss';

type Props = {
  term: string;
  placeholder: string;
  handleSearch: (term: string) => void;
};

const SearchForm = ({ term, placeholder, handleSearch }: Props) => {
  return (
    <Formik
      initialValues={{ term }}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values: SearchModel) => {
        handleSearch(values.term);
      }}
      onReset={() => {
        handleSearch('');
      }}
    >
      {() => (
        <Form>
          <div className={styles.searchForm}>
            <Field as={InputBlock} name="term" placeholder={placeholder} />
            <div className={styles.buttons}>
              <Button text="Search" type="submit" color="secondary" icon={searchIcon} />
              <Button className={styles.resetButton} text="Reset search" type="reset" color="transparent" />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export { SearchForm };
