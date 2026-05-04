import { Fieldset } from '@/shared/ui';

import { getItemLabel, getNextLevelName } from '../../helpers';
import type { PayloadItemProps } from '../../model';

const TupleItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel}>
      {(typeStructure.type as any[]).map((item, index) =>
        renderNextItem({
          levelName: getNextLevelName(levelName, index),
          typeStructure: item,
        }),
      )}
    </Fieldset>
  );
};

export { TupleItem };
