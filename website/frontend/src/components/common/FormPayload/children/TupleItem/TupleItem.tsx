import { PayloadItemProps } from '../../types';
import { getNextLevelName } from '../../helpers';

import { Fieldset } from 'components/common/Fieldset';

const TupleItem = ({ levelName, typeStructure, renderNextItem }: PayloadItemProps) => (
  <Fieldset legend={typeStructure.name}>
    {/*@ts-ignore*/}
    {typeStructure.value.map((item, index) =>
      renderNextItem({
        levelName: getNextLevelName(levelName, index),
        typeStructure: item,
      })
    )}
  </Fieldset>
);

export { TupleItem };
