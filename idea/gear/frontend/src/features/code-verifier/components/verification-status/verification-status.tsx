import clsx from 'clsx';
import styles from './verification-status.module.scss';
import { Skeleton } from '@/shared/ui';

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

function VerificationStatusSkeleton() {
  return <Skeleton width="5rem" className={styles.status} />;
}

VerificationStatus.Skeleton = VerificationStatusSkeleton;

export { VerificationStatus };
