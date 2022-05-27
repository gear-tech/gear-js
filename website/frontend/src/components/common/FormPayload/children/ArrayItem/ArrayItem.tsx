import { useMemo } from 'react';

import styles from '../../FormPayload.module.scss';
import { PayloadItemProps } from '../../types';
import { getNextLevelName } from '../../helpers';

import { Fieldset } from 'components/common/Fieldset';

const ArrayItem = ({ levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const arrayItems = useMemo(() => {
    const { value, count } = typeStructure;

    return new Array(count || 0).fill(value);
  }, [typeStructure]);

  return (
    <Fieldset legend={typeStructure.name} className={styles.fieldset}>
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
