import { Fieldset } from 'shared/ui/Fieldset';

import styles from '../../FormPayload.module.scss';
import { PayloadItemProps } from '../../model/types';
import { getItemLabel, getNextLevelName } from '../../helpers';

const TupleItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel} className={styles.fieldset}>
      {/* @ts-ignore */}
      {typeStructure.value.map((item, index) =>
        renderNextItem({
          levelName: getNextLevelName(levelName, index),
          typeStructure: item,
        }),
      )}
    </Fieldset>
  );
};

export { TupleItem };
