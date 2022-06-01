import styles from '../../FormPayload.module.scss';
import { PayloadItemProps } from '../../types';
import { getItemLabel, getNextLevelName } from '../../helpers';

import { Fieldset } from 'components/common/Fieldset';

const StructItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel} className={styles.fieldset}>
      {Object.entries(typeStructure.value).map((item) => {
        const [key, value] = item;

        return renderNextItem({
          title: key,
          levelName: getNextLevelName(levelName, key),
          typeStructure: value,
        });
      })}
    </Fieldset>
  );
};

export { StructItem };
