import React from 'react';
import { Button } from '@gear-js/ui';
import { Field, Form, Formik } from 'formik';
import { SearchModel } from 'types/program';
import { InputBlock } from './children';
import searchIcon from 'assets/images/search.svg';
import { Schema } from './Schema';
import styles from './SearchForm.module.scss';

type Props = {
  query: string;
  placeholder: string;
  handleSearch: (query: string) => void;
};

const SearchForm = ({ query, placeholder, handleSearch }: Props) => {
  return (
    <Formik
      initialValues={{ query }}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values: SearchModel) => {
        handleSearch(values.query);
      }}
      onReset={() => {
        handleSearch('');
      }}
    >
      {() => (
        <Form>
          <div className={styles.searchForm}>
            <Field as={InputBlock} name="query" placeholder={placeholder} />
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
