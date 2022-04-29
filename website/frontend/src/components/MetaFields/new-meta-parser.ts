import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import setWith from 'lodash.setwith';

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
  | 'BTreeSet';

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
  return (
    !(typeof value == 'boolean') &&
    !isString(value) &&
    isObject(value) &&
    'type' in value &&
    'name' in value &&
    'label' in value
  );
}

function isPrimitive(value: MetaItemValue) {
  return !isString(value) && 'type' in value && value.type === 'Primitive';
}

function isMetaItem(value: unknown): value is MetaItem {
  return isObject(value) && 'type' in value && 'value' in value && 'name' in value;
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
  return (
    !(typeof value == 'boolean') &&
    !isString(value) &&
    isObject(value) &&
    '__name' in value &&
    '__type' in value &&
    '__select' in value &&
    '__fields' in value
  );
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
  path: string[];
  value: MetaItemValue;
  name: string;
} | null;

const NoneField = { None: { type: 'Primitive', name: 'None', value: 'None' } };

function processFields(data: MetaItem, _path?: string[], isField = false): StackItem | null {
  const path = _path || [];
  if (isMetaItem(data)) {
    if (!isField) {
      path.push(data.name);
    }
    return {
      kind: data.type,
      path: path,
      value: data.value,
      name: data.name,
    };
  }

  if (data.type === 'Enum') {
    return {
      kind: data.type,
      path: [...path, data.name],
      value: data.value,
      name: data.name,
    };
  }

  if (data.type === 'Option') {
    return {
      kind: data.type,
      path: [...path, data.name],
      value: data.value,
      name: data.name,
    };
  }

  if (data.type === 'Result') {
    return {
      kind: data.type,
      path: [...path, data.name],
      value: data.value,
      name: data.name,
    };
  }

  return null;
}

function processStruct(resultRef: MetaFieldsStruct, stackRef: StackItem[], current: NonNullable<StackItem>) {
  const key = current.path.at(-1);
  const entries = Object.entries(current.value).reverse();
  const isSelect = entries[0].some((i) => i === '_enum' || i === '_enum_Result' || i === '_enum_Option');
  setUpField(resultRef, current.path, key!, isSelect);

  // Process fieldset field
  if (isMetaItem(current.value)) {
    stackRef.push(processFields(current.value, [...current.path, '__fields']));
  } else {
    entries.forEach(([name, value]) => {
      if (isPrimitive(value)) {
        stackRef.push(
          processFields(
            {
              type: value.type,
              name,
              value: value,
            },
            [...current.path, '__fields']
          )
        );
      }
    });
  }
}

function processStackItem(stackRef: StackItem[], payload: NonNullable<StackItem>) {
  if (isMetaItem(payload.value)) {
    stackRef.push(processFields(payload.value, payload.path, true));
  } else if (Array.isArray(payload.value)) {
    payload.value.forEach((item) => {
      if (isMetaItem(item)) {
        stackRef.push(processFields(item, [...payload.path, '__fields']));
        return;
      }
    });
  } else {
    Object.entries(payload.value)
      .reverse()
      .forEach(([vKey, vValue]) => {
        // fieldset
        if (isMetaItem(vValue)) {
          stackRef.push(processFields(vValue, [...payload.path, '__fields']));
          return;
        }
      });
  }
}

function setUpField(targetRef: MetaFieldsStruct, path: string[], key: string, select = false) {
  setWith(targetRef, [...path, '__fields'], null, Object);
  setWith(targetRef, [...path, '__name'], key, Object);
  setWith(targetRef, [...path, '__path'], path.filter((item) => item !== '__fields').join('.'), Object);
  setWith(targetRef, [...path, '__type'], '__fieldset', Object);
  setWith(targetRef, [...path, '__select'], select, Object);
}

function parseField(data: MetaItem) {
  const result: MetaFieldsStruct = {
    __root: null,
    __values: null,
  };

  const stack: StackItem[] = [];

  stack.push(
    processFields({
      type: 'Struct',
      name: '__root',
      value: data,
    })
  );

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
        // region Parse if it is Struct
        if (current.kind === 'Struct') {
          processStruct(result, stack, current);
        }
        // endregion
        // region Parse if it is Tuple
        if (current.kind === 'Tuple') {
          setUpField(result, current.path, current.name);
          processStackItem(stack, current);
        }
        // endregion
        // region Parse if it is Array
        if (current.kind === 'Array') {
          setUpField(result, current.path, current.name);
          processStackItem(stack, current);
        }
        // endregion
        //region Parse if it is enum
        else if (current.kind === 'Enum') {
          setUpField(result, current.path, current.name, true);
          Object.entries(current.value)
            .reverse()
            .forEach(([vKey, vValue]) => {
              // fieldset
              if (isMetaItem(vValue)) {
                stack.push(processFields(vValue, [...current.path, '__fields']));
                return;
              }
            });
        }
        //endregion
        //region Parse if it is BTreeMap
        else if (current.kind === 'BTreeMap') {
          setUpField(result, current.path, current.name);
          processStackItem(stack, current);
        }
        //endregion
        //region Parse if it is BTreeMap
        else if (current.kind === 'BTreeSet') {
          setUpField(result, current.path, current.name);
          processStackItem(stack, current);
        }
        //endregion
        //region Parse if it is Vec
        else if (current.kind === 'Vec') {
          if (isMetaItem(current.value)) {
            processStackItem(stack, current);
          } else {
            setUpField(result, current.path, current.name);
            processStackItem(stack, current);
          }
        }
        //endregion
        //region Parse if it is Option
        else if (current.kind === 'Option') {
          setUpField(result, current.path, current.name, true);
          current.value = isMetaItem(current.value)
            ? Object.assign(
                {
                  [`${current.value.name}`]: current.value,
                },
                NoneField
              )
            : Object.assign(current.value, NoneField); // TODO add deep clone
          processStackItem(stack, current);
        }
        //endregion
        //region Parse if it is Result
        else if (current.kind === 'Result') {
          setUpField(result, current.path, current.name, true);
          if (isMetaItem(current.value)) {
            stack.push(processFields(current.value, [...current.path, '__fields']));
          } else {
            Object.entries(current.value)
              .reverse()
              .forEach(([name, value]) => {
                if (isPrimitive(value)) {
                  stack.push(
                    processFields(
                      {
                        type: value.type,
                        name,
                        value: value,
                      },
                      [...current.path, '__fields']
                    )
                  );
                }
              });
          }
        }
        //endregion
      }
    }
  }

  return result;
}

export function parseMeta(data: MetaItem): MetaFieldsStruct | null {
  if (isObject(data)) {
    if (Object.keys(data).length === 0) {
      return null;
    }
    return parseField(data);
  }

  return null;
}

export type PreparedMetaData = {
  [key: string]: string | PreparedMetaData;
};
