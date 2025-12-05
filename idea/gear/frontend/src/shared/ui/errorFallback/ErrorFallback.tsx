import { FallbackProps } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';

import { useChangeEffect } from '@/hooks';

import { BackButton } from '../backButton';
import { Subheader } from '../subheader';

import styles from './ErrorFallback.module.scss';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;

  try {
    const json = JSON.stringify(error, null, 2);

    return json.length > 500 ? json.slice(0, 500) + '...' : json;
  } catch {
    return "Can't retrieve error message";
  }
};

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { pathname } = useLocation();

  useChangeEffect(() => {
    resetErrorBoundary();
  }, [pathname]);

  return (
    <>
      <Subheader title="An unexpected error occurred:" />
      <p className={styles.error}>{getErrorMessage(error)}</p>
      <BackButton />
    </>
  );
};

export { ErrorFallback };
