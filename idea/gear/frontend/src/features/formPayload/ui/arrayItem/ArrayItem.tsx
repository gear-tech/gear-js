import { useMemo } from 'react';

import { Fieldset } from '@/shared/ui';

import { getItemLabel, getNextLevelName } from '../../helpers';
import { PayloadItemProps } from '../../model';

const ArrayItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { type, len } = typeStructure;

  const arrayItems = useMemo(() => new Array(len || 0).fill(type), [type, len]);

  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel}>
      {arrayItems.map((item, index) =>
        renderNextItem({
          levelName: getNextLevelName(levelName, index),
          typeStructure: item,
        }),
      )}
    </Fieldset>
  );
};

export { ArrayItem };
