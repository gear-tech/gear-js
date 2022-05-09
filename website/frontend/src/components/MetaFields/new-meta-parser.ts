import isObject from 'lodash.isobject';
import setWith from 'lodash.setwith';

export type PreparedMetaData = {
  [key: string]: string | PreparedMetaData;
};

export type MetaTypes =
  | 'Enum'
  | 'Struct'
  | 'Primitive'
  | 'Option'
  | 'Vec'
  | 'Result'
  | 'Tuple'
  | 'Array'
  | 'BTreeMap'
  | 'BTreeSet'
  | 'None';

export type MetaItem = {
  type: MetaTypes;
  name: string;
  value: MetaItemValue;
};

export type MetaItemValue = string | MetaItem | MetaItem[] | Record<string, MetaItem>;

export type MetaField = {
  type: MetaTypes;
  name: string;
  label: string;
};

export function isMetaField(value: unknown): value is MetaField {
  return isObject(value) && 'type' in value && 'name' in value && 'label' in value;
}

function isMetaItem(value: unknown): value is MetaItem {
  return isObject(value) && 'type' in value && 'value' in value && 'name' in value;
}

function isPrimitive(value: MetaItem) {
  return value.type === 'Primitive';
}

export type MetaFieldsItem = MetaField | MetaFieldset;
export type MetaFieldsItemStruct = Record<string, MetaFieldsItem>;

export type MetaFieldset = {
  __name: string;
  __path: string;
  __type: string;
  __select: boolean;
  __fields: MetaFieldsItemStruct;
};

export function isMetaFieldset(value: unknown): value is MetaFieldset {
  return isObject(value) && '__name' in value && '__type' in value && '__select' in value && '__fields' in value;
}

export type MetaFieldsValues = {
  [key: string]: string | MetaFieldsValues;
};

export type MetaFieldsStruct = {
  __root: MetaFieldset | null;
  __values: MetaFieldsValues | null;
};

type StackItem = {
  kind: MetaTypes;
  key: string;
  path: string[];
  value: MetaItemValue;
} | null;

const NoneField = { None: { type: 'Primitive', name: 'None', value: 'None' } };

function setUpField(targetRef: MetaFieldsStruct, path: string[], key: string, select = false) {
  setWith(targetRef, [...path, '__fields'], null, Object);
  setWith(targetRef, [...path, '__name'], key, Object);
  setWith(targetRef, [...path, '__path'], path.filter((item) => item !== '__fields').join('.'), Object);
  setWith(targetRef, [...path, '__type'], '__fieldset', Object);
  setWith(targetRef, [...path, '__select'], select, Object);
}

function isSelect(value: string) {
  switch (value) {
    case 'Result':
      return true;
    case 'Option':
      return true;
    case 'Enum':
      return true;
    default:
      return false;
  }
}

function processStackItem(resultRef: MetaFieldsStruct, stackRef: StackItem[], current: NonNullable<StackItem>) {
  if (Array.isArray(current.value)) {
    setUpField(resultRef, current.path, current.key, isSelect(current.kind));
    current.value.forEach((item) => {
      if (isMetaItem(item)) {
        stackRef.push({
          kind: item.type,
          path: [...current.path, '__fields', item.name],
          value: item.value,
          key: item.name,
        });
        return;
      }
    });
  } else if (isObject(current.value)) {
    if (isMetaItem(current.value)) {
      if (isPrimitive(current.value)) {
        stackRef.push({
          kind: current.value.type,
          path: current.path,
          value: current.value.value,
          key: current.key,
        });
      } else {
        setUpField(resultRef, current.path, current.key, isSelect(current.kind));
        stackRef.push({
          kind: current.value.type,
          path: [...current.path, '__fields', current.value.name],
          value: current.value.value,
          key: current.value.name,
        });
      }
    } else {
      setUpField(resultRef, current.path, current.key, isSelect(current.kind));
      Object.entries(current.value)
        .reverse()
        .forEach(([key, value]) => {
          if (isMetaItem(value)) {
            stackRef.push({
              kind: value.type,
              path: [...current.path, '__fields', key],
              value: value.value,
              key,
            });
            return;
          }
        });
    }
  }
}

function parseField(data: MetaItem) {
  const result: MetaFieldsStruct = {
    __root: null,
    __values: null,
  };

  const stack: StackItem[] = [];

  stack.push({
    kind: 'Struct',
    key: '__root',
    path: ['__root'],
    value: data,
  });

  while (stack.length > 0) {
    const current = stack.pop();

    if (current) {
      if (!result.__values) {
        result.__values = {};
      }

      // Check if this primitive
      if (current.kind === 'Primitive') {
        const key = current.path.at(-1);
        setWith(
          result,
          current.path,
          {
            label: key,
            name: current.path.filter((i) => i !== '__fields').join('.'),
            type: isMetaItem(current.value) ? current.value.value : current.value,
          },
          Object
        );

        setWith(
          result.__values,
          current.path.filter((i) => !['__root', '__fields'].includes(i)),
          current.value === 'None' ? 'None' : '',
          Object
        );
      } else if (isObject(current.value)) {
        if (
          current.kind === 'Struct' ||
          current.kind === 'Tuple' ||
          current.kind === 'Array' ||
          current.kind === 'Enum' ||
          current.kind === 'BTreeMap' ||
          current.kind === 'BTreeSet' ||
          current.kind === 'Result'
        ) {
          processStackItem(result, stack, current);
        } else if (current.kind === 'Vec') {
          current.value = isMetaItem(current.value)
            ? {
                type: 'Primitive',
                name: current.value.name,
                value: current.value.name,
              }
            : { ...current.value };
          processStackItem(result, stack, current);
        } else if (current.kind === 'Option') {
          current.value = isMetaItem(current.value)
            ? Object.assign(
                {
                  [`${current.value.name}`]: current.value,
                },
                NoneField
              )
            : Object.assign(current.value, NoneField); // TODO add deep clone
          processStackItem(result, stack, current);
        }
      }
    }
  }

  return result;
}

export function parseMeta(data: MetaItem): MetaFieldsStruct | null {
  if (isObject(data) && Object.keys(data).length !== 0) {
    return parseField(data);
  }

  return null;
}
