import { Fieldset } from 'shared/ui/fieldset';

import { PayloadItemProps } from '../../model';
import { getItemLabel, getNextLevelName } from '../../helpers';

const TupleItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel}>
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
