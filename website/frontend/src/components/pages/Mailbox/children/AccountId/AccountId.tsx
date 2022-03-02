import React, { FC } from 'react';
import { Field, Form, Formik } from 'formik';
import { useMailBoxContext } from '../../context/context';
import { LOCAL_STORAGE } from 'consts';
import { useApi } from 'hooks/useApi';
import { SearchIcon } from 'assets/Icons';

import { getMails } from '../../helpers';
import styles from './AccountId.module.scss';

export const AccountId: FC = () => {
  const [api] = useApi();
  const { dispatch } = useMailBoxContext();

  const initialValues = {
    publicKey: localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW),
  };

  const handleSubmit = async (values: any) => {
    getMails(api, values.publicKey, dispatch);
  };

  return (
    <div className={styles.item}>
      <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
        {() => (
          <Form className={styles.form}>
            <p className={styles.caption}>Account Id:</p>
            <div className={styles.block}>
              <div className={styles.value}>
                <button type="submit" className={styles.btn}>
                  <SearchIcon color="#BBBBBB" />
                </button>
                <Field className={styles.field} id="publicKey" name="publicKey" type="text " />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
