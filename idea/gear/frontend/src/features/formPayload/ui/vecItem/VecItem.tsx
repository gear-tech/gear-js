import { Textarea } from '@gear-js/ui';
import { useFormContext } from 'react-hook-form';

import { getItemLabel } from '../../helpers';
import { PayloadItemProps } from '../../model/types';
import styles from '../FormPayload.module.scss';

const VecItem = ({ title, levelName, typeStructure }: PayloadItemProps) => {
  const { register } = useFormContext();

  const itemLabel = getItemLabel(typeStructure.name, title);

  return <Textarea {...register(levelName)} rows={8} label={itemLabel} direction="y" className={styles.field} />;
};

export { VecItem };
