import { Fieldset } from '@/shared/ui';

import { getItemLabel, getNextLevelName } from '../../helpers';
import { PayloadItemProps } from '../../model';

const StructItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel}>
      {Object.entries(typeStructure.type).map((item) => {
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
