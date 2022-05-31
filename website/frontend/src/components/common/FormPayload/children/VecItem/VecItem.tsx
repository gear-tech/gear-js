import { useField } from 'formik';
import { Textarea } from '@gear-js/ui';

import styles from '../../FormPayload.module.scss';
import { getItemLabel } from '../../helpers';
import { PayloadItemProps } from '../../types';

const VecItem = ({ title, levelName, typeStructure }: PayloadItemProps) => {
  const [field] = useField<string>(levelName);

  const itemLabel = getItemLabel(typeStructure.name, title);

  return <Textarea {...field} value={field.value || ''} rows={8} label={itemLabel} className={styles.field} />;
};

export { VecItem };
