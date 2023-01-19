import { useField } from 'react-final-form';
import { Input } from '@gear-js/ui';

import { getItemLabel } from '../../helpers';
import { PayloadItemProps } from '../../model';
import styles from '../FormPayload.module.scss';

const PrimitiveItem = ({ title, levelName, typeStructure }: PayloadItemProps) => {
  const { input } = useField(levelName);

  const itemLabel = getItemLabel(typeStructure.name, title);

  return <Input {...input} label={itemLabel} direction="y" className={styles.field} />;
};

export { PrimitiveItem };
