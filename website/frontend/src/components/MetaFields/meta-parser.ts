import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import setWith from 'lodash.setwith';

export type MetaItem = {
  [key: string | MetaEnumType]: string | MetaItem;
};

type MetaTypes = 'Text' | 'Null';

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

type MetaEnumType = '_enum' | '_enum_Option' | '_enum_Result' | string;

enum MetaEnum {
  Enum = '_enum',
  EnumOption = '_enum_Option',
  EnumResult = '_enum_Result',
}

type StackKind = 'field' | 'fieldset' | 'enum' | 'enum_option' | 'enum_result';

type StackItem = {
  kind: StackKind;
  path: string[];
  value: string | MetaItem;
};

function processFields(data: MetaItem, path?: string[]): StackItem[] {
  return Object.entries(data).reduce<StackItem[]>((accum, item) => {
    const [key, value] = item;
    if (key === MetaEnum.Enum) {
      accum.push({
        kind: 'enum',
        path: [...(path || []), key],
        value: value as MetaItem, // TODO: find out why types not infer as expected
      });
    } else if (key === MetaEnum.EnumOption) {
      accum.push({
        kind: 'enum_option',
        path: [...(path || []), key],
        value: value as MetaItem,
      });
    } else if (key === MetaEnum.EnumResult) {
      accum.push({
        kind: 'enum_result',
        path: [...(path || []), key],
        value: value as MetaItem,
      });
    } else if (isObject(value)) {
      accum.push({
        kind: 'fieldset',
        path: [...(path || []), key],
        value: value,
      });
    } else if (isString(value)) {
      accum.push({
        kind: 'field',
        path: [...(path || []), key],
        value: value,
      });
    }
    return accum;
  }, []);
}

function parseField(data: MetaItem) {
  const result: MetaFieldsStruct = {
    __root: null,
    __values: null,
  };

  const stack: StackItem[] = [];

  stack.push(
    ...processFields({
      __root: data,
    })
  );

  while (stack.length > 0) {
    const current = stack.pop();

    if (current) {
      if (!result.__values) {
        result.__values = {};
      }

      // Check if this field
      if (isString(current.value) && current.kind === 'field') {
        const key = current.path.at(-1);
        setWith(
          result,
          current.path,
          {
            label: key,
            name: current.path.filter((i) => i !== '__fields').join('.'),
            type: current.value,
          },
          Object
        );

        setWith(
          result.__values,
          current.path.filter((i) => !['__root', '__fields'].includes(i)),
          current.value === 'Null' ? 'Null' : '',
          Object
        );
      } else if (isObject(current.value)) {
        // region Parse if it is fieldset
        if (current.kind === 'fieldset') {
          const key = current.path.at(-1);
          setWith(result, [...current.path, '__fields'], null, Object);
          setWith(result, [...current.path, '__name'], key, Object);
          setWith(result, [...current.path, '__path'], current.path.filter((i) => i !== '__fields').join('.'), Object);
          setWith(result, [...current.path, '__type'], '__fieldset', Object);

          const entries = Object.entries(current.value).reverse();

          setWith(
            result,
            [...current.path, '__select'],
            entries[0].some((i) => i === '_enum' || i === '_enum_Result' || i === '_enum_Option'),
            Object
          );

          // eslint-disable-next-line max-depth
          if (entries[0].some((i) => i === '_enum_Option')) {
            setWith(result, [...current.path, '__type'], 'enum_option', Object);
          }

          // eslint-disable-next-line max-depth
          if (entries[0].some((i) => i === '_enum_Result')) {
            setWith(result, [...current.path, '__type'], 'enum_result', Object);
          }

          // Process fieldset fields
          entries.forEach(([vKey, vValue], index) => {
            // Enum option
            if (vKey === '_enum_Option') {
              stack.push(
                ...processFields(
                  {
                    __null: 'Null',
                  },
                  [...current.path, '__fields']
                )
              );
              stack.push(
                ...processFields(
                  {
                    [`__field-${index}`]: vValue,
                  },
                  [...current.path, '__fields']
                )
              );
              return;
            }
            // field
            if (isString(vValue)) {
              stack.push(
                ...processFields(
                  {
                    [vKey]: vValue,
                  },
                  [...current.path, '__fields']
                )
              );
              return;
            }
            // fieldset
            if (isObject(vValue)) {
              stack.push(
                ...processFields(
                  {
                    [vKey]: vValue,
                  },
                  [...current.path, '__fields']
                )
              );
              return;
            }
          });
        }
        // endregion
        // region enum_Option
        else if (current.kind === 'enum_option') {
          Object.entries(current.value)
            .reverse()
            .forEach(([vKey, vValue]) => {
              const path = current.path.filter((item) => item !== '_enum_Option');
              // field
              if (isString(vValue)) {
                stack.push(
                  ...processFields(
                    {
                      [vKey]: vValue,
                    },
                    [...path]
                  )
                );
                return;
              }
              // fieldset
              if (isObject(vValue)) {
                stack.push(
                  ...processFields(
                    {
                      [vKey]: vValue,
                    },
                    [...path]
                  )
                );
                return;
              }
            });
        }
        // endregion
        // region enum_Result
        else if (current.kind === 'enum_result') {
          Object.entries(current.value)
            .reverse()
            .forEach(([vKey, vValue]) => {
              const path = current.path.filter((item) => item !== '_enum_Result');
              // field
              if (isString(vValue)) {
                stack.push(
                  ...processFields(
                    {
                      [vKey]: vValue,
                    },
                    [...path]
                  )
                );
                return;
              }
              // fieldset
              if (isObject(vValue)) {
                stack.push(
                  ...processFields(
                    {
                      [vKey]: vValue,
                    },
                    [...path]
                  )
                );
                return;
              }
            });
        }
        // endregion
        //region Parse if it is enum
        else if (current.kind === 'enum') {
          // Process fieldset fields
          Object.entries(current.value)
            .reverse()
            .forEach(([vKey, vValue]) => {
              const path = current.path.filter((item) => item !== '_enum');
              // field
              if (isString(vValue)) {
                stack.push(
                  ...processFields(
                    {
                      [vKey]: vValue,
                    },
                    [...path]
                  )
                );
                return;
              }
              // fieldset
              if (isObject(vValue)) {
                stack.push(
                  ...processFields(
                    {
                      [vKey]: vValue,
                    },
                    [...path]
                  )
                );
                return;
              }
            });
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
