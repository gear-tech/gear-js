import { Fieldset } from '@/shared/ui';

import { PayloadItemProps } from '../../model';
import { getItemLabel, getNextLevelName } from '../../helpers';

const TupleItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel}>
      {/* @ts-expect-error - TODO: fix Property 'map' does not exist on type 'string' */}
      {typeStructure.type.map((item, index) =>
        renderNextItem({
          levelName: getNextLevelName(levelName, index),
          typeStructure: item,
        }),
      )}
    </Fieldset>
  );
};

export { TupleItem };
