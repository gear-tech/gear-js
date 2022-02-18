import React, { FC, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { LOCAL_STORAGE } from 'consts';
import { useApi } from 'hooks/useApi';
import { SearchIcon } from 'assets/Icons';
import styles from './AccountId.module.scss';

export const AccountId: FC = () => {
  const [api] = useApi();

  const initialValues = {
    publicKey: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
  };

  const handleSubmit = async (values: any) => {
    const a = await api.mailbox.read(values.publicKey);
    console.log(a.toHuman());
  };

  return (
    <div className={styles.item}>
      <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
        {() => (
          <Form className={styles.form}>
            <p className={styles.caption}>Account Id:</p>
            <div className={styles.value}>
              <button type="submit" className={styles.btn}>
                <SearchIcon color="#BBBBBB" />
              </button>
              <Field className={styles.field} id="publicKey" name="publicKey" type="text " />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
