import { useField } from 'formik';
import { Input } from '@gear-js/ui';

import styles from '../../FormPayload.module.scss';

import { getItemLabel } from '../../helpers';
import { PayloadItemProps } from '../../model/types';

const PrimitiveItem = ({ title, levelName, typeStructure }: PayloadItemProps) => {
  const [field] = useField<string>(levelName);

  const itemLabel = getItemLabel(typeStructure.name, title);

  return <Input {...field} value={field.value || ''} label={itemLabel} className={styles.field} />;
};

export { PrimitiveItem };
