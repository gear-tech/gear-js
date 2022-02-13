import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import set from 'lodash.set';
import get from 'lodash.get';
import merge from 'lodash.merge';

type MetaNull = 'Null';
const metaNull = 'Null';

type MetaTypes = 'Text' | 'Null';

export type ParsedValue = {
  type: MetaTypes;
  name: string;
  label: string;
};

export type ParsedStruct = {
  [key: string]: ParsedStruct | ParsedValue;
};

export type ParsedFormValue = {
  [key: string]: ParsedFormValue;
};

export type ParsedShape = {
  select: Record<
    string,
    {
      type: MetaEnums;
      fields: { [key: string]: ParsedStruct };
      NoFields?: {
        NoFields: null;
      };
    }
  > | null;
  fields: ParsedStruct | null;
  values: ParsedStruct | null;
};

// function isObjectEmpty(obj: object) {
//     for (const i in obj) return false;
//     return true;
// }

// function isObject(obj: unknown) {
//     const type = typeof obj;
//     return type === "function" || (type === "object" && !!obj);
// }

// function isString(str: unknown): boolean {
//     return typeof str === 'string' || str instanceof String
// }

enum MetaEnums {
  Enum = '_enum',
  EnumOption = '_enum_Option',
  EnumResult = '_enum_Result',
}

type MetaField = { [key: string]: { [key: string]: string | MetaField } };
type MetaParam = {} | [] | MetaField;

function parseField(data: MetaParam) {
  const result: ParsedShape = {
    select: null,
    fields: null,
    values: null,
  };

  const stack: {
    kind: 'field' | 'enum' | 'enum_option' | 'enum_result';
    path: string[];
    value: (string | MetaField) | MetaNull;
  }[] = [];

  Object.entries(data).forEach((item) => {
    if (item[0] === MetaEnums.Enum) {
      if (!result.select) {
        result.select = {};
      }

      result.select[Object.keys(item[1]).join('.')] = {
        type: MetaEnums.Enum,
        fields: {},
      };

      Object.entries(item[1]).forEach((field) => {
        if (isObject(field[1])) {
          stack.push({
            kind: 'enum',
            path: [Object.keys(item[1]).join('.'), 'fields', field[0]],
            value: field[1],
          });
        } else if (field[1] === metaNull) {
          stack.push({
            kind: 'enum',
            path: [Object.keys(item[1]).join('.'), 'fields', field[0]],
            value: metaNull as MetaNull,
          });
        } else {
          stack.push({
            kind: 'enum',
            path: [Object.keys(item[1]).join('.'), 'fields', field[0]],
            value: field[1],
          });
        }
      });
    } else {
      stack.push({
        kind: 'field',
        path: [item[0]],
        value: item[1] as MetaField,
      });
    }
  });

  while (stack.length > 0) {
    const current = stack.pop();

    if (current) {
      if (current.value === metaNull) {
        if (current.kind === 'enum' && result.select) {
          set(result.select, current.path, {
            type: 'Null',
            name: current.path.slice(1).join('.'),
            label: current.path[current.path.length - 1],
          });

          // eslint-disable-next-line max-depth
          if (!result.values) {
            result.values = {};
          }
          set(result.values, current.path.slice(2), null);
        } else if (current.kind === 'field') {
          // eslint-disable-next-line max-depth
          if (!result.fields) {
            result.fields = {};
          }
          set(result.fields, current.path, {
            [current.path.toString()]: null,
          });

          if (!result.values) {
            result.values = {};
          }
          set(result.values, current.path, '');
        }
      }
      if (isString(current.value) && current.value !== metaNull) {
        if (current.kind === 'enum' && result.select) {
          const path = [...current.path];
          path.shift();
          const key = path[path.length - 1];
          set(result.select, current.path, {
            label: key,
            name: ['fields', key].join('.'),
            type: current.value,
          });

          if (!result.values) {
            result.values = {};
          }
          set(result.values, path.slice(1), '');
        }
      } else {
        Object.entries(current.value).forEach((item) => {
          const key = item[0];
          const value = item[1];

          // Detecting _enum_Option field
          if (key === MetaEnums.EnumOption) {
            if (!result.select) {
              result.select = {};
            }
            set(result.select, current.path, {
              type: MetaEnums.EnumOption,
              NoFields: {
                type: 'Null',
                name: 'fields.NoFields', // TODO: add if field deep
                label: 'NoFields',
              },
            });
            stack.push({
              kind: 'enum_option',
              path: [...current.path, 'fields'],
              value: { [`${current.path}`]: value },
            });
          }
          // Detecting _enum_Result field
          else if (key === MetaEnums.EnumResult) {
            if (!result.select) {
              result.select = {};
            }
            set(result.select, current.path, {
              type: MetaEnums.EnumResult,
            });
            Object.entries(value).forEach((val) => {
              if (val[0] === 'ok') {
                stack.push({
                  kind: 'enum_result',
                  path: [...current.path, 'fields', 'ok'],
                  value: { [`${current.path}`]: val[1] } as MetaField,
                });
              }
              if (val[0] === 'err') {
                stack.push({
                  kind: 'enum_result',
                  path: [...current.path, 'fields', 'err'],
                  value: { [`${current.path}`]: val[1] } as MetaField,
                });
              }
            });
          } else if (isObject(value)) {
            // Parse _enum_Option values
            if (current.kind === 'enum_option') {
              stack.push({
                kind: 'enum_option',
                path: current.path[0] === key ? current.path : [...current.path, key],
                value: value as MetaField,
              });
            } else if (current.kind === 'field') {
              stack.push({
                kind: 'field',
                path: [...current.path, key],
                value: value as MetaField,
              });
            }
          } else if (isString(value) || value === null) {
            if (current.kind === 'enum' && current.value !== metaNull) {
              if (!result.select) {
                result.select = {};
              }

              const path = [...current.path];
              path.shift();
              set(
                result.select,
                [...current.path],
                merge(get(result.select, current.path), {
                  [key]: {
                    label: key,
                    name: ['fields', ...path.filter((i) => i !== 'fields'), key].join('.'),
                    type: value,
                  },
                })
              );

              if (!result.values) {
                result.values = {};
              }
              set(result.values, [...current.path.slice(2), key], '');
            } else if (current.kind === 'enum_option') {
              if (result.select) {
                const path = [...current.path];
                const root = path.shift();

                const pt = [...path.filter((i) => i !== 'fields'), key];
                set(
                  result.select,
                  current.path,
                  merge(get(result.select, current.path), {
                    [key]: {
                      label: key,
                      name: ['fields', ...pt].join('.'),
                      type: value,
                    },
                  })
                );

                if (!result.values) {
                  result.values = {};
                }
                if (root) {
                  // FIXME: refactor this
                  set(result.values, pt[0] === root ? root : [root, ...pt], '');
                }
              }
            } else if (current.kind === 'enum_result') {
              if (result.select) {
                set(result.select, current.path, {
                  label: current.path[current.path.length - 1],
                  name: ['fields', ...current.path.filter((i) => i !== 'fields')].join('.'),
                  type: value,
                });

                if (!result.values) {
                  result.values = {};
                }
                set(result.values, current.path.slice(2), '');
              }
            } else if (current.kind === 'field') {
              if (!result.fields) {
                result.fields = {};
              }
              set(
                result.fields,
                current.path,
                merge(get(result.fields, current.path), {
                  [key]: {
                    label: key,
                    name: ['fields', ...current.path, key].join('.'),
                    type: value,
                  },
                })
              );

              if (!result.values) {
                result.values = {};
              }
              set(
                result.values,
                current.path,
                merge(get(result.values, current.path), {
                  [key]: '',
                })
              );
            }
          }
        });
      }
    }
  }

  if (result.select && Object.values(result.select).length > 0) {
    const option = Object.values(result.select)[0];
    const field = Object.entries(option.fields).reverse()[0];
    result.fields = { [`${field[0]}`]: JSON.parse(JSON.stringify(field[1])) };
  }

  return result;
}

export function parseMeta(data: MetaParam): ParsedShape | null {
  if (isObject(data)) {
    if (Object.keys(data).length === 0) {
      return null;
    }
    return parseField(data);
  }

  return null;
}
