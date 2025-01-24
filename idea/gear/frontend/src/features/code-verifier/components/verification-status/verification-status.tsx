import clsx from 'clsx';

import { Skeleton } from '@/shared/ui';

import styles from './verification-status.module.scss';

type Props = {
  value: 'verified' | 'failed' | 'pending' | 'in_progress';
};

const TEXT = {
  verified: 'Verified',
  failed: 'Failed',
  pending: 'Pending',
  in_progress: 'In Progress',
} as const;

function VerificationStatus({ value }: Props) {
  return <span className={clsx(styles.status, styles[value])}>{TEXT[value]}</span>;
}

function VerificationStatusSkeleton({ disabled }: { disabled: boolean }) {
  return <Skeleton width="5rem" className={styles.status} disabled={disabled} />;
}

VerificationStatus.Skeleton = VerificationStatusSkeleton;

export { VerificationStatus };
