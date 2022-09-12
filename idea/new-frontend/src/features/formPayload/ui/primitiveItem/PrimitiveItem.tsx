import { useField } from 'react-final-form';
import { Input } from '@gear-js/ui';

import styles from '../FormPayload.module.scss';

import { getItemLabel } from '../../helpers';
import { PayloadItemProps } from '../../model';

const PrimitiveItem = ({ title, levelName, typeStructure }: PayloadItemProps) => {
  const { input } = useField(levelName);

  const itemLabel = getItemLabel(typeStructure.name, title);

  return <Input {...input} value={input.value || ''} label={itemLabel} className={styles.field} />;
};

export { PrimitiveItem };
