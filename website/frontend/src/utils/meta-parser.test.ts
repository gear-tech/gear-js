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
        __select: null,
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
        __select: null,
        __fields: {
          AddMessage: {
            __type: '__fieldset',
            __name: 'AddMessage',
            __select: null,
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
        __select: null,
        __fields: {
          AddMessage: {
            __type: '__fieldset',
            __name: 'AddMessage',
            __select: null,
            __fields: {
              To: {
                __type: '__fieldset',
                __name: 'To',
                __select: null,
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

  it('simple enum', () => {
    expect(parseMeta(simpleEnum)).toEqual({
      __root: {
        __type: '__fieldset',
        __name: '__root',
        __select: {
          AddMessage: {
            author: {
              type: 'Text',
              name: 'meta.AddMessage.author',
              label: 'author',
            },
            msg: {
              type: 'Text',
              name: 'meta.AddMessage.msg',
              label: 'msg',
            },
          },
          Post: {
            type: 'Text',
            name: 'meta.Post',
            label: 'Post',
          },
          ViewMessages: {
            type: 'Null',
            name: 'meta.ViewMessages',
            label: 'ViewMessages',
          },
        },
        __fields: {
          AddMessage: {
            author: {
              type: 'Text',
              name: 'meta.AddMessage.author',
              label: 'author',
            },
            msg: {
              type: 'Text',
              name: 'meta.AddMessage.msg',
              label: 'msg',
            },
          },
        },
      },
      values: {
        AddMessage: {
          author: '',
          msg: '',
        },
        Post: '',
        ViewMessages: 'Null',
      },
    });
  });

  it('simple option enum', () => {
    expect(parseMeta(enumOptionSimple)).toEqual({
      select: {
        __root__: {
          type: '_enum_Option',
          fields: {
            __root__: {
              type: 'String',
              name: 'meta.__root__',
              label: '__root__',
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
        __root__: {
          type: 'String',
          name: 'meta.__root__',
          label: '__root__',
        },
      },
      values: {
        __root__: '',
      },
    });
  });

  it('option enum with fields object', () => {
    expect(parseMeta(enumOptionWithFieldsObject)).toEqual({
      select: {
        ['__field[0]']: {
          type: '_enum_Option',
          fields: {
            ['__field[0]']: {
              firstName: {
                type: 'String',
                name: 'meta.__field[0].firstName',
                label: 'firstName',
              },
              lastName: {
                type: 'String',
                name: 'meta.__field[0].firstName',
                label: 'firstName',
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
        ['__field[0]']: {
          type: 'String',
          name: 'meta.__field[0]',
          label: '__field[0]',
        },
      },
      values: {
        ['__field[0]']: '',
      },
    });
  });

  it('nested option enum', () => {
    expect(parseMeta(nestedEnumOption)).toEqual({
      select: {
        field: {
          type: '_enum_Option',
          fields: {
            field: {
              type: 'String',
              name: 'meta.field',
              label: 'field',
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
        field: {
          type: 'String',
          name: 'meta.field',
          label: 'field',
        },
      },
      values: {
        field: '',
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
