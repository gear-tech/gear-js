import { FallbackProps } from 'react-error-boundary';

import { BackButton } from '../backButton';
import { Subheader } from '../subheader';

import styles from './ErrorFallback.module.scss';

const ErrorFallback = ({ error }: FallbackProps) => (
  <>
    <Subheader title="An unexpected error occured:" />
    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- TODO(#1800): resolve eslint comments */}
    <p className={styles.error}>{error.message}</p>
    <BackButton />
  </>
);

export { ErrorFallback };
