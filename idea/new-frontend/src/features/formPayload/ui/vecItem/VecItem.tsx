import { useField } from 'react-final-form';
import clsx from 'clsx';
import { Textarea } from '@gear-js/ui';

import styles from '../FormPayload.module.scss';
import { getItemLabel } from '../../helpers';
import { PayloadItemProps } from '../../model/types';

const VecItem = ({ title, levelName, typeStructure }: PayloadItemProps) => {
  const { input } = useField(levelName);

  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Textarea
      {...input}
      value={input.value || ''}
      rows={8}
      label={itemLabel}
      className={clsx(styles.field, styles.textarea)}
    />
  );
};

export { VecItem };
