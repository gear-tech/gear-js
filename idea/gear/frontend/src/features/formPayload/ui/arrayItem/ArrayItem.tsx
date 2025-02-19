import { useMemo } from 'react';

import { Fieldset } from '@/shared/ui';

import { getItemLabel, getNextLevelName } from '../../helpers';
import { PayloadItemProps } from '../../model';

const ArrayItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { type, len } = typeStructure;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- TODO(#1800): resolve eslint comments
  const arrayItems = useMemo(() => new Array(len || 0).fill(type), [type, len]);

  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel}>
      {arrayItems.map((item, index) =>
        renderNextItem({
          levelName: getNextLevelName(levelName, index),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
          typeStructure: item,
        }),
      )}
    </Fieldset>
  );
};

export { ArrayItem };
