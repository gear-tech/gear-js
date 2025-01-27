import { VerifyForm } from '@/features/code-verifier';

import styles from './verify.module.scss';

function Verify() {
  return (
    <>
      <h1 className={styles.heading}>Verify Code</h1>
      <VerifyForm />
    </>
  );
}

export { Verify };
