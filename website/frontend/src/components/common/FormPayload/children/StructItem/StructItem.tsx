import { PayloadItemProps } from '../../types';
import { getNextLevelName } from '../../helpers';

import { Fieldset } from 'components/common/Fieldset';

const StructItem = ({ levelName, typeStructure, renderNextItem }: PayloadItemProps) => (
  <Fieldset legend={typeStructure.name}>
    {Object.entries(typeStructure.value).map((item) =>
      renderNextItem({
        title: item[0],
        levelName: getNextLevelName(levelName, item[0]),
        //@ts-ignore
        typeStructure: item[1],
      })
    )}
  </Fieldset>
);

export { StructItem };
