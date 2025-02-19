import { Fieldset } from '@/shared/ui';

import { getItemLabel, getNextLevelName } from '../../helpers';
import { PayloadItemProps } from '../../model';

const StructItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const itemLabel = getItemLabel(typeStructure.name, title);

  return (
    <Fieldset legend={itemLabel}>
      {Object.entries(typeStructure.type).map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
        const [key, value] = item;

        return renderNextItem({
          title: key,
          levelName: getNextLevelName(levelName, key),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
          typeStructure: value,
        });
      })}
    </Fieldset>
  );
};

export { StructItem };
