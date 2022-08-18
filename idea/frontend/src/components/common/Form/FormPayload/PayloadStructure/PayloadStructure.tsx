import { VFC, useCallback } from 'react';

import { ValueType, PayloadItemProps, PayloadStructureProps } from '../types';
import { VecItem } from '../children/VecItem';
import { EnumItem } from '../children/EnumItem';
import { TupleItem } from '../children/TupleItem';
import { ArrayItem } from '../children/ArrayItem';
import { OptionItem } from '../children/OptionItem';
import { StructItem } from '../children/StructItem';
import { PrimitiveItem } from '../children/PrimitiveItem';

type Props = Omit<PayloadStructureProps, 'title'>;

const PayloadStructure = (props: Props) => {
  const renderNextItem = useCallback((itemProps: PayloadStructureProps) => {
    let Component: VFC<PayloadItemProps>;

    const { title, levelName, typeStructure } = itemProps;

    switch (typeStructure?.type) {
      case ValueType.Vec:
      case ValueType.BTreeMap:
      case ValueType.BTreeSet: {
        Component = VecItem;
        break;
      }
      case ValueType.Null: {
        return null;
      }
      case ValueType.Enum:
      case ValueType.Result: {
        Component = EnumItem;
        break;
      }
      case ValueType.Array: {
        Component = ArrayItem;
        break;
      }
      case ValueType.Tuple: {
        Component = TupleItem;
        break;
      }
      case ValueType.Option: {
        Component = OptionItem;
        break;
      }
      case ValueType.Struct: {
        Component = StructItem;
        break;
      }
      case ValueType.Primitive: {
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
