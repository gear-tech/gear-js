import { useField } from 'formik';
import { Input } from '@gear-js/ui';

import styles from '../../FormPayload.module.scss';

import { PayloadItemProps } from '../../types';

const PrimitiveItem = ({ title, levelName, typeStructure }: PayloadItemProps) => {
  const [field] = useField<string>(levelName);

  const label = title ? `${title} (${typeStructure.name})` : typeStructure.name;

  return <Input {...field} value={field.value || ''} label={label} className={styles.field} />;
};

export { PrimitiveItem };
