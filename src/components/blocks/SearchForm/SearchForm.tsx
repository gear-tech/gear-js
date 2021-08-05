import React from "react";
import { Formik, Form, Field } from 'formik';

import { SearchModel } from "types/program";
import { SearchIcon } from "Icons";
import { Schema } from "./Schema";

import './SearchForm.scss';

type Props = {
    handleSearch: (searchQuery: string) => void;
    handleRemoveAllQueries: () => void;
}

const SearchForm = ({ handleSearch, handleRemoveAllQueries }: Props) => {

    const mapInitialValues = () => ({
        programHash: ''
    })

    return (
        <Formik
            initialValues={mapInitialValues()}
            validationSchema={Schema}
            validateOnBlur
            onSubmit={(
                values: SearchModel
            ) => {
                handleSearch(values.programHash);
            }}
            onReset={() => {
                handleRemoveAllQueries();
            }}
        >
        {() => (
            <Form>
                <div className="search-form">
                    <div className="search-form--field-wrapper">
                        <SearchIcon color="#BBBBBB"/>
                        <Field 
                            id="programHash" 
                            name="programHash" 
                            type="text"
                            className="search-form__input"
                            placeholder="Search..."
                        />
                    </div>
                    <div className="search-form--btns">
                        <button
                            className="search-form--btns__button"
                            type="submit">
                                <SearchIcon color="#FFFFFF"/>
                                Search
                        </button>
                        {/* eslint-disable react/button-has-type */}
                        <button
                            className="search-form--btns__button"
                            type="reset"
                            aria-label="resetSearch">
                                Reset search
                        </button>
                        {/* eslint-disable react/button-has-type */}
                    </div>
                </div>
            </Form>
        )}
        </Formik>
    )
}

export { SearchForm };