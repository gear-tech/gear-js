import { Fieldset } from 'shared/ui/fieldset';

import { PayloadItemProps } from '../../model';
import { getItemLabel, getNextLevelName } from '../../helpers';

const StructItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel}>
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
