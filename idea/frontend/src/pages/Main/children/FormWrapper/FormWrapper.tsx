import { ReactNode } from 'react';

import styles from './FormWrapper.module.scss';

import { Box } from 'layout/Box/Box';

type Props = {
  header: string;
  children: ReactNode;
};

const FormWrapper = ({ children, header }: Props) => (
  <Box className={styles.formWrapper}>
    <h3 className={styles.heading}>{header}</h3>
    <div className={styles.content}>{children}</div>
  </Box>
);

export { FormWrapper };
