import { parseMeta } from './meta-parser';

import {
  simpleDeepStruct,
  simpleStruct,
  enumSimple,
  optionEnumSimple,
  optionEnumComplex,
  optionEnumNested,
  optionEnumWithFieldsObject,
  resultEnumSimple,
  resultEnumComplex,
  simpleNestedStruct,
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
    expect(parseMeta(simpleStruct)).toEqual({
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
    expect(parseMeta(simpleNestedStruct)).toEqual({
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

  it('simple enum', () => {
    expect(parseMeta(enumSimple)).toEqual({
      __root: {
        __type: '__fieldset',
        __name: '__root',
        __select: true,
        __fields: {
          AddMessage: {
            __type: '__fieldset',
            __name: 'AddMessage',
            __select: false,
            __fields: {
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
          Post: {
            type: 'Text',
            name: '__root.Post',
            label: 'Post',
          },
          ViewMessages: {
            type: 'Null',
            name: '__root.ViewMessages',
            label: 'ViewMessages',
          },
        },
      },
      __values: {
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
    expect(parseMeta(optionEnumSimple)).toEqual({
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
    expect(parseMeta(optionEnumWithFieldsObject)).toEqual({
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
    expect(parseMeta(optionEnumNested)).toEqual({
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
    expect(parseMeta(optionEnumComplex)).toEqual({
      __root: {
        __name: '__root',
        __type: '__fieldset',
        __select: false,
        __fields: {
          res: {
            __fields: {
              '__field[0]': {
                __fields: {
                  id: {
                    __fields: {
                      decimal: {
                        label: 'decimal',
                        name: '__root.res.__field[0].id.decimal',
                        type: 'u64',
                      },
                      hex: {
                        label: 'hex',
                        name: '__root.res.__field[0].id.hex',
                        type: 'Bytes',
                      },
                    },
                    __name: 'id',
                    __select: false,
                    __type: '__fieldset',
                  },
                  person: {
                    __fields: {
                      name: {
                        label: 'name',
                        name: '__root.res.__field[0].person.name',
                        type: 'Text',
                      },
                      surname: {
                        label: 'surname',
                        name: '__root.res.__field[0].person.surname',
                        type: 'Text',
                      },
                    },
                    __name: 'person',
                    __select: false,
                    __type: '__fieldset',
                  },
                },
                __name: '__field[0]',
                __select: false,
                __type: '__fieldset',
              },
              __null: {
                label: '__null',
                name: '__root.res.__null',
                type: 'Null',
              },
            },
            __name: 'res',
            __select: true,
            __type: 'enum_option',
          },
        },
      },
      __values: {
        res: {
          '__field[0]': {
            id: {
              decimal: '',
              hex: '',
            },
            person: {
              name: '',
              surname: '',
            },
          },
          __null: 'Null',
        },
      },
    });
  });

  it('with simple result enum', () => {
    expect(parseMeta(resultEnumSimple)).toEqual({
      __root: {
        __name: '__root',
        __type: '__fieldset',
        __select: false,
        __fields: {
          exchangeRate: {
            __name: 'exchangeRate',
            __type: 'enum_result',
            __select: true,
            __fields: {
              ok: {
                type: 'u8',
                name: '__root.exchangeRate.ok',
                label: 'ok',
              },
              err: {
                type: 'u8',
                name: '__root.exchangeRate.err',
                label: 'err',
              },
            },
          },
        },
      },
      __values: {
        exchangeRate: {
          ok: '',
          err: '',
        },
      },
    });
  });

  it('with complex result enum', () => {
    expect(parseMeta(resultEnumComplex)).toEqual({
      __root: {
        __fields: {
          exchangeRate: {
            __fields: {
              err: {
                __fields: {
                  '__field[0]': {
                    label: '__field[0]',
                    name: '__root.exchangeRate.err.__field[0]',
                    type: 'String',
                  },
                  __null: {
                    label: '__null',
                    name: '__root.exchangeRate.err.__null',
                    type: 'Null',
                  },
                },
                __name: 'err',
                __select: true,
                __type: 'enum_option',
              },
              ok: {
                __fields: {
                  firstName: {
                    label: 'firstName',
                    name: '__root.exchangeRate.ok.firstName',
                    type: 'Text',
                  },
                  secondName: {
                    label: 'secondName',
                    name: '__root.exchangeRate.ok.secondName',
                    type: 'Text',
                  },
                },
                __name: 'ok',
                __select: false,
                __type: '__fieldset',
              },
            },
            __name: 'exchangeRate',
            __select: true,
            __type: 'enum_result',
          },
        },
        __name: '__root',
        __select: false,
        __type: '__fieldset',
      },
      __values: {
        exchangeRate: {
          err: {
            '__field[0]': '',
            __null: 'Null',
          },
          ok: {
            firstName: '',
            secondName: '',
          },
        },
      },
    });
  });
});
