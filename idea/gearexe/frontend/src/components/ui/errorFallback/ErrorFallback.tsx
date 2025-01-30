import { FallbackProps } from "react-error-boundary";

import styles from "./ErrorFallback.module.scss";

const ErrorFallback = ({ error }: FallbackProps) => (
  <>
    <h2>An unexpected error occured:</h2>
    <p className={styles.error}>{error.message}</p>
  </>
);

export { ErrorFallback };
