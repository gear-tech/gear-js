import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import set from 'lodash.set';
import get from 'lodash.get';
import merge from 'lodash.merge';

type MetaNull = 'Null';
const metaNull = 'Null';

type MetaItem = {
  [key: string | MetaEnumType]: string | MetaItem;
};

type MetaTypes = 'Text' | 'Null';

type MetaField = {
  type: MetaTypes;
  name: string;
  label: string;
};

type MetaFormItem = {
  [key: string]: MetaField | MetaFieldset;
};

type MetaFieldset = {
  __name: string;
  __type: string;
  __select: boolean;
  __fields: MetaFormItem | null;
};

type FormValues = {
  [key: string]: string | FormValues;
};

type MetaFormStruct = {
  __root: MetaFieldset | null;
  __values: FormValues | null;
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

type PathSpecialKeys = '__select' | '__fields' | '__name' | '__values' | '__type';

function isOdd(num: number) {
  return num % 2;
}

function createFieldsetPath(path: string[]) {
  return path.reduce<string[]>((accum, item, index) => {
    if (!isOdd(index)) {
      accum.push(item);
      accum.push('__fields');
      return accum;
    }

    accum.push(item);
    return accum;
  }, []);
}

function parseField(data: MetaItem) {
  const result: MetaFormStruct = {
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
        set(result, current.path, {
          label: key,
          name: current.path.filter((i) => i !== '__fields').join('.'),
          type: current.value,
        });

        set(
          result.__values,
          current.path.filter((i) => !['__root', '__fields'].includes(i)),
          current.value === 'Null' ? 'Null' : ''
        );
      } else if (isObject(current.value)) {
        // Parse if it is fieldset
        if (current.kind === 'fieldset') {
          const key = current.path.at(-1);
          set(result, [...current.path, '__fields'], null);
          set(result, [...current.path, '__name'], key);
          set(result, [...current.path, '__type'], '__fieldset');

          const entries = Object.entries(current.value);

          set(
            result,
            [...current.path, '__select'],
            entries[0].some((i) => i === '_enum' || i === '_enum_Result' || i === '_enum_Option')
          );

          if (entries[0].some((i) => i === '_enum_Option')) {
            set(result, [...current.path, '__type'], 'enum_option');
          }

          // Process fieldset fields
          entries.forEach(([vKey, vValue], index) => {
            // Enum option
            if (vKey === '_enum_Option') {
              stack.push(
                ...processFields(
                  {
                    [`__field[${index}]`]: vValue,
                  },
                  [...current.path, '__fields']
                )
              );
              stack.push(
                ...processFields(
                  {
                    __null: 'Null',
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
        } else if (current.kind === 'field') {
          const key = current.path[current.path.length - 1];
          if (!result.fields) {
            result.fields = {};
          }

          set(result.fields, current.path, {
            label: key,
            name: ['fields', ...current.path].join('.'),
            type: current.value,
          });
        }

        // enum_Option
        if (current.kind === 'enum_option') {
          Object.entries(current.value).forEach(([vKey, vValue], index) => {
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

        // Parse if it is enum
        else if (current.kind === 'enum') {
          // Process fieldset fields
          Object.entries(current.value).forEach(([vKey, vValue]) => {
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
      }
    }
  }

  return result;
}

export function parseMeta(data: MetaItem): MetaFormStruct | null {
  if (isObject(data)) {
    if (Object.keys(data).length === 0) {
      return null;
    }
    return parseField(data);
  }

  return null;
}
