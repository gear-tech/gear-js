import React from 'react';
import { Input } from '@gear-js/ui';
import { FieldProps } from 'formik';
import searchIcon from 'assets/images/search.svg';
import styles from './InputBlock.module.scss';

type Props = {
  props: FieldProps;
};

const InputBlock = (props: Props) => <Input icon={searchIcon} className={styles.inputWrapper} type="text" {...props} />;

export { InputBlock };
