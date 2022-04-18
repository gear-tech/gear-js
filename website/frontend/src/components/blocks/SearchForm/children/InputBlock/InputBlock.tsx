import React from 'react';
import { Input } from '@gear-js/ui';
import { FieldProps } from 'formik';
import { SearchIcon } from 'assets/Icons';
import styles from './InputBlock.module.scss';

type Props = {
  props: FieldProps;
};

const InputBlock = (props: Props) => {
  const iconColor = '#BBBBBB';

  return (
    <div className={styles.inputBlock}>
      <div className={styles.icon}>
        <SearchIcon color={iconColor} />
      </div>
      <Input className={styles.inputWrapper} type="text" {...props} />
    </div>
  );
};

export { InputBlock };
