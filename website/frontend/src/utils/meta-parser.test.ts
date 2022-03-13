import { parseMeta } from './meta-parser';

import {
  simpleDeepStruct,
  simpleStruct,
  simpleEnum,
  enumOptionSimple,
  complexEnumOption,
  simpleEnumResult,
  nestedEnumOption,
  enumOptionWithFieldsObject,
} from './meta-fixtures';

// result
// 1. OK
// 2. Err

// option
// 1. null
// 2. type

// enum custom fields from select

// {
//   "initialValues": {
//   "payload": "{\n    \"_enum_Option\": \"String\"\n}",
//     "fields": "{}"
// }

describe('test parser', () => {
  // TODO add edge case tests e.g for null, empty array, empty objects

  it('simple struct', () => {
    expect(
      parseMeta({
        amount: 'u8',
        currency: 'Text',
      })
    ).toEqual({
      __root: {
        __type: '__fieldset',
        __name: '__root',
        __select: false,
        __fields: {
          amount: {
            label: 'amount',
            type: 'u8',
            name: '__root.amount',
          },
          currency: {
            label: 'currency',
            type: 'Text',
            name: '__root.currency',
          },
        },
      },
      __values: {
        amount: '',
        currency: '',
      },
    });
  });

  it('nested simple struct', () => {
    expect(parseMeta(simpleStruct)).toEqual({
      __root: {
        __type: '__fieldset',
        __name: '__root',
        __select: false,
        __fields: {
          AddMessage: {
            __type: '__fieldset',
            __name: 'AddMessage',
            __select: false,
            __fields: {
              author: {
                label: 'author',
                type: 'Text',
                name: '__root.AddMessage.author',
              },
              msg: {
                label: 'msg',
                type: 'Text',
                name: '__root.AddMessage.msg',
              },
            },
          },
        },
      },
      __values: {
        AddMessage: {
          author: '',
          msg: '',
        },
      },
    });
  });

  it('simple deep struct', () => {
    expect(parseMeta(simpleDeepStruct)).toEqual({
      __root: {
        __type: '__fieldset',
        __name: '__root',
        __select: false,
        __fields: {
          AddMessage: {
            __type: '__fieldset',
            __name: 'AddMessage',
            __select: false,
            __fields: {
              To: {
                __type: '__fieldset',
                __name: 'To',
                __select: false,
                __fields: {
                  name: {
                    type: 'Text',
                    name: '__root.AddMessage.To.name',
                    label: 'name',
                  },
                  from: {
                    type: 'Text',
                    name: '__root.AddMessage.To.from',
                    label: 'from',
                  },
                },
              },
              author: {
                type: 'Text',
                name: '__root.AddMessage.author',
                label: 'author',
              },
              msg: {
                type: 'Text',
                name: '__root.AddMessage.msg',
                label: 'msg',
              },
            },
          },
        },
      },
      __values: {
        AddMessage: {
          To: {
            name: '',
            from: '',
          },
          author: '',
          msg: '',
        },
      },
    });
  });

  it('simple option enum', () => {
    expect(parseMeta(enumOptionSimple)).toEqual({
      __root: {
        __name: '__root',
        __type: 'enum_option',
        __select: true,
        __fields: {
          [`__field[0]`]: {
            type: 'String',
            name: '__root.__field[0]',
            label: '__field[0]',
          },
          __null: {
            name: '__root.__null',
            label: '__null',
            type: 'Null',
          },
        },
      },
      __values: {
        [`__field[0]`]: '',
        __null: 'Null',
      },
    });
  });

  it('option enum with fields object', () => {
    expect(parseMeta(enumOptionWithFieldsObject)).toEqual({
      __root: {
        __name: '__root',
        __type: 'enum_option',
        __select: true,
        __fields: {
          ['__field[0]']: {
            __fields: {
              firstName: {
                label: 'firstName',
                name: '__root.__field[0].firstName',
                type: 'Text',
              },
              lastName: {
                label: 'lastName',
                name: '__root.__field[0].lastName',
                type: 'Text',
              },
            },
            __name: '__field[0]',
            __select: false,
            __type: '__fieldset',
          },
          __null: {
            name: '__root.__null',
            label: '__null',
            type: 'Null',
          },
        },
      },
      __values: {
        '__field[0]': {
          firstName: '',
          lastName: '',
        },
        __null: 'Null',
      },
    });
  });

  it('nested option enum', () => {
    expect(parseMeta(nestedEnumOption)).toEqual({
      __root: {
        __name: '__root',
        __type: '__fieldset',
        __select: false,
        __fields: {
          field: {
            __name: 'field',
            __type: 'enum_option',
            __select: true,
            __fields: {
              [`__field[0]`]: {
                type: 'String',
                name: '__root.field.__field[0]',
                label: '__field[0]',
              },
              __null: {
                name: '__root.field.__null',
                label: '__null',
                type: 'Null',
              },
            },
          },
        },
      },
      __values: {
        field: {
          [`__field[0]`]: '',
          __null: 'Null',
        },
      },
    });
  });

  it('with complex option enum', () => {
    expect(parseMeta(complexEnumOption)).toEqual({
      select: {
        res: {
          type: '_enum_Option',
          fields: {
            id: {
              decimal: {
                type: 'u64',
                name: 'meta.id.decimal',
                label: 'decimal',
              },
              hex: {
                type: 'Bytes',
                name: 'meta.id.hex',
                label: 'hex',
              },
            },
            person: {
              surname: {
                type: 'Text',
                name: 'meta.person.surname',
                label: 'surname',
              },
              name: {
                type: 'Text',
                name: 'meta.person.name',
                label: 'name',
              },
            },
          },
          NoFields: {
            name: 'meta.NoFields',
            label: 'NoFields',
            type: 'Null',
          },
        },
      },
      fields: {
        id: {
          decimal: {
            type: 'u64',
            name: 'meta.id.decimal',
            label: 'decimal',
          },
          hex: {
            type: 'Bytes',
            name: 'meta.id.hex',
            label: 'hex',
          },
        },
      },
      values: {
        res: {
          id: {
            decimal: '',
            hex: '',
          },
          person: {
            surname: '',
            name: '',
          },
        },
      },
    });
  });

  it('with simple result enum', () => {
    expect(parseMeta(simpleEnumResult)).toEqual({
      select: {
        exchangeRate: {
          type: '_enum_Result',
          fields: {
            ok: {
              type: 'u8',
              name: 'meta.exchangeRate.ok',
              label: 'ok',
            },
            err: {
              type: 'u8',
              name: 'meta.exchangeRate.err',
              label: 'err',
            },
          },
        },
      },
      fields: {
        ok: {
          type: 'u8',
          name: 'meta.exchangeRate.ok',
          label: 'ok',
        },
      },
      values: {
        ok: '',
        err: '',
      },
    });
  });

  it('with complex result enum', () => {
    expect(parseMeta(simpleEnumResult)).toEqual({
      select: {
        exchangeRate: {
          type: '_enum_Result',
          fields: {
            ok: {
              type: 'u8',
              name: 'meta.exchangeRate.ok',
              label: 'ok',
            },
            err: {
              type: 'u8',
              name: 'meta.exchangeRate.err',
              label: 'err',
            },
          },
        },
      },
      fields: {
        ok: {
          label: 'ok',
          name: 'meta.exchangeRate.ok',
          type: 'u8',
        },
      },
      values: {
        err: '',
        ok: '',
      },
    });
  });
});
