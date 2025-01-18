import { FallbackProps } from 'react-error-boundary';

import { Subheader } from '../subheader';
import { BackButton } from '../backButton';
import styles from './ErrorFallback.module.scss';

const ErrorFallback = ({ error }: FallbackProps) => (
  <>
    <Subheader title="An unexpected error occured:" />
    <p className={styles.error}>{error.message}</p>

    <BackButton />
  </>
);

export { ErrorFallback };
