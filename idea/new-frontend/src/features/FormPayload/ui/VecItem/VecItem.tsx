import { useField } from 'formik';
import clsx from 'clsx';
import { Textarea } from '@gear-js/ui/dist/esm';

import styles from '../../FormPayload.module.scss';
import { getItemLabel } from '../../helpers';
import { PayloadItemProps } from '../../model/types';

const VecItem = ({ title, levelName, typeStructure }: PayloadItemProps) => {
  const [field] = useField<string>(levelName);

  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Textarea
      {...field}
      value={field.value || ''}
      rows={8}
      label={itemLabel}
      className={clsx(styles.field, styles.textarea)}
    />
  );
};

export { VecItem };
