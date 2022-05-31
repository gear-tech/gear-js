import styles from '../../FormPayload.module.scss';
import { PayloadItemProps } from '../../types';
import { getItemLabel, getNextLevelName } from '../../helpers';

import { Fieldset } from 'components/common/Fieldset';

const StructItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel} className={styles.fieldset}>
      {Object.entries(typeStructure.value).map((item) =>
        renderNextItem({
          title: item[0],
          levelName: getNextLevelName(levelName, item[0]),
          typeStructure: item[1],
        })
      )}
    </Fieldset>
  );
};

export { StructItem };
