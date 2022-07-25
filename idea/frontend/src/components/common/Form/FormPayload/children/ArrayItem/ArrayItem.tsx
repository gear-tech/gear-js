import { useMemo } from 'react';

import styles from '../../FormPayload.module.scss';
import { PayloadItemProps } from '../../types';
import { getItemLabel, getNextLevelName } from '../../helpers';

import { Fieldset } from 'components/common/Fieldset';

const ArrayItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { value, count } = typeStructure;

  const arrayItems = useMemo(() => new Array(count || 0).fill(value), [value, count]);

  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel} className={styles.fieldset}>
      {arrayItems.map((item, index) =>
        renderNextItem({
          levelName: getNextLevelName(levelName, index),
          typeStructure: item,
        })
      )}
    </Fieldset>
  );
};

export { ArrayItem };
