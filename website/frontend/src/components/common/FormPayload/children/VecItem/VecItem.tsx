import { useField } from 'formik';
import { Textarea } from '@gear-js/ui';

import styles from '../../FormPayload.module.scss';
import { PayloadItemProps } from '../../types';

const VecItem = ({ levelName, typeStructure }: PayloadItemProps) => {
  const [field] = useField<string>(levelName);

  return <Textarea {...field} value={field.value || ''} rows={8} label={typeStructure.name} className={styles.field} />;
};

export { VecItem };
