import React, { VFC } from 'react';
import { Field, Form, Formik } from 'formik';
import { SearchModel } from 'types/program';
import { SearchIcon } from 'assets/Icons';
import { Schema } from './Schema';
import './SearchForm.scss';

type Props = {
  handleSearch: (searchQuery: string) => void;
  handleRemoveQuery: () => void;
  placeholder: string;
};

export const SearchForm: VFC<Props> = ({ handleSearch, handleRemoveQuery, placeholder }) => {
  const mapInitialValues = () => ({
    searchQuery: '',
  });

  return (
    <Formik
      initialValues={mapInitialValues()}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values: SearchModel) => {
        handleSearch(values.searchQuery);
      }}
      onReset={() => {
        handleRemoveQuery();
      }}
    >
      {() => (
        <Form>
          <div className="search-form">
            <div className="search-form--field-wrapper">
              <div className="search-form__icon">
                <SearchIcon color="#BBBBBB" />
              </div>
              <Field
                id="searchQuery"
                name="searchQuery"
                type="text"
                className="search-form__input"
                placeholder={placeholder}
              />
            </div>
            <div className="search-form--btns">
              <button className="search-form--btns__button" type="submit">
                <SearchIcon color="#FFFFFF" />
                Search
              </button>
              <button className="search-form--btns__button" type="reset" aria-label="resetSearch">
                Reset search
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
