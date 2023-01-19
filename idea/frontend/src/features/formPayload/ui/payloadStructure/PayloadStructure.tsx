import { VFC, useCallback } from 'react';

import { PayloadItemProps, PayloadStructureProps } from '../../model';
import { VecItem } from '../vecItem';
import { EnumItem } from '../enumItem';
import { TupleItem } from '../tupleItem';
import { ArrayItem } from '../arrayItem';
import { StructItem } from '../structItem';
import { PrimitiveItem } from '../primitiveItem';
import { OptionItem } from '../optionItem';

type Props = Omit<PayloadStructureProps, 'title'>;

const PayloadStructure = (props: Props) => {
  const renderNextItem = useCallback((itemProps: PayloadStructureProps) => {
    let Component: VFC<PayloadItemProps>;

    const { title, levelName, typeStructure } = itemProps;

    switch (typeStructure?.kind) {
      case 'sequence': {
        Component = VecItem;
        break;
      }

      case 'variant': {
        Component = EnumItem;
        break;
      }

      case 'option': {
        Component = OptionItem;
        break;
      }

      case 'array': {
        Component = ArrayItem;
        break;
      }

      case 'tuple': {
        Component = TupleItem;
        break;
      }

      case 'composite': {
        Component = StructItem;
        break;
      }

      case 'primitive':
      case 'actorid': {
        Component = PrimitiveItem;
        break;
      }

      default:
        return null;
    }

    return (
      <Component
        key={levelName}
        title={title}
        levelName={levelName}
        typeStructure={typeStructure}
        renderNextItem={renderNextItem}
      />
    );
  }, []);

  return renderNextItem(props);
};

export { PayloadStructure };
