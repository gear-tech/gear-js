import { Input } from '@gear-js/ui';
import { useFormContext } from 'react-hook-form';

import { getItemLabel } from '../../helpers';
import { PayloadItemProps } from '../../model';
import styles from '../FormPayload.module.scss';

const PrimitiveItem = ({ title, levelName, typeStructure }: PayloadItemProps) => {
  const { register } = useFormContext();

  const itemLabel = getItemLabel(typeStructure.name, title);

  return <Input {...register(levelName)} label={itemLabel} direction="y" className={styles.field} />;
};

export { PrimitiveItem };
