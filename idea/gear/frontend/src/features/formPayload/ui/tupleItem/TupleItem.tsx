import { Fieldset } from '@/shared/ui';

import { getItemLabel, getNextLevelName } from '../../helpers';
import { PayloadItemProps } from '../../model';

const TupleItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO(#1800): resolve eslint comments */}
      {(typeStructure.type as any[]).map((item, index) =>
        renderNextItem({
          levelName: getNextLevelName(levelName, index),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
          typeStructure: item,
        }),
      )}
    </Fieldset>
  );
};

export { TupleItem };
