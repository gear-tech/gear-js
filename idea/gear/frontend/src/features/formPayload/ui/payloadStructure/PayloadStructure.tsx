import { FunctionComponent, useCallback } from 'react';

import { PayloadItemProps, PayloadStructureProps } from '../../model';
import { EnumItem } from '../enumItem';
import { OptionItem } from '../optionItem';
import { PrimitiveItem } from '../primitiveItem';
import { StructItem } from '../structItem';
import { TupleItem } from '../tupleItem';
import { VecItem } from '../vecItem';

type Props = Omit<PayloadStructureProps, 'title'>;

const PayloadStructure = (props: Props) => {
  const renderNextItem = useCallback((itemProps: PayloadStructureProps) => {
    let Component: FunctionComponent<PayloadItemProps>;

    const { title, levelName, typeStructure } = itemProps;

    switch (typeStructure?.kind) {
      case 'sequence':
      case 'array': {
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
