import React, { useEffect, useRef, useState, VFC } from 'react';
import { Field, Form, Formik } from 'formik';
import { SearchModel } from 'types/program';
import { SEARCH_DROPDOWN } from 'fixtures';
import { DropdownArrow, SearchIcon } from 'assets/Icons';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';
import { Schema } from './Schema';
import './SearchForm.scss';

type Props = {
  handleSearch: (searchQuery: string) => void;
  handleRemoveQuery: () => void;
  handleDropdownItemSelect?: (index: number) => void;
  searchType?: number;
};

export const SearchForm: VFC<Props> = ({ handleSearch, handleRemoveQuery, handleDropdownItemSelect, searchType }) => {
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [isSearchDropdownOpened, setIsSearchDropdownOpened] = useState(false);

  const mapInitialValues = () => ({
    searchQuery: '',
  });

  const handleSearchDropdown = () => {
    if (!isSearchDropdownOpened) {
      setIsSearchDropdownOpened(true);
    }
  };

  const handleCloseDropdown = () => {
    setIsSearchDropdownOpened(false);
  };

  useEffect(() => {
    const handleClickOutsideDropdown = (event: MouseEvent) => {
      if (isSearchDropdownOpened && dropdownMenuRef && !dropdownMenuRef.current?.contains(event.target as Node)) {
        handleCloseDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDropdown);

    return () => document.removeEventListener('mousedown', handleClickOutsideDropdown);
  }, [isSearchDropdownOpened, dropdownMenuRef, setIsSearchDropdownOpened]);

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
                placeholder="Find program by ID"
              />
              {typeof searchType === 'number' && (
                <div className="search-form--type">
                  <button className="search-form--type__btn" type="button" onClick={handleSearchDropdown}>
                    <span>{SEARCH_DROPDOWN[searchType]}</span>
                    <DropdownArrow />
                  </button>
                  {isSearchDropdownOpened && typeof handleDropdownItemSelect === 'function' && (
                    <DropdownMenu
                      dropdownMenuRef={dropdownMenuRef}
                      handleDropdownBtnClick={handleDropdownItemSelect}
                      handleCloseDropdown={handleCloseDropdown}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="search-form--btns">
              <button className="search-form--btns__button" type="submit">
                <SearchIcon color="#FFFFFF" />
                Search
              </button>
              {/* eslint-disable react/button-has-type */}
              <button className="search-form--btns__button" type="reset" aria-label="resetSearch">
                Reset search
              </button>
              {/* eslint-disable react/button-has-type */}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

SearchForm.defaultProps = {
  handleDropdownItemSelect: undefined,
  searchType: undefined,
};
