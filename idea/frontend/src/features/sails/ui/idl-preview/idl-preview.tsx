import { PreformattedBlock } from '@/shared/ui';

import styles from './idl-preview.module.scss';

type Props = {
  value: string;
};

function IdlPreview({ value }: Props) {
  return <PreformattedBlock text={value} />;
}

export { IdlPreview };
