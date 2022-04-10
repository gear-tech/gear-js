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
  daoMeta,
  enumNested,
  simpleStructResult,
  simpleNestedStructResult,
  simpleDeepStructResult,
  enumSimpleResult,
  enumNestedResult,
  daoMetaResult,
} from './meta-fixtures';

describe('test parser', () => {
  // TODO add edge case tests e.g for null, empty array, empty objects

  it('simple struct', () => {
    expect(parseMeta(simpleStruct)).toEqual(simpleStructResult);
  });

  it('nested simple struct', () => {
    expect(parseMeta(simpleNestedStruct)).toEqual(simpleNestedStructResult);
  });

  it('simple deep struct', () => {
    expect(parseMeta(simpleDeepStruct)).toEqual(simpleDeepStructResult);
  });

  it('simple enum', () => {
    expect(parseMeta(enumSimple)).toEqual(enumSimpleResult);
  });

  it('nested enum', () => {
    expect(parseMeta(enumNested)).toEqual(enumNestedResult);
  });

  it('dao enum', () => {
    expect(parseMeta(daoMeta)).toEqual(daoMetaResult);
  });

  it('simple option enum', () => {
    expect(parseMeta(optionEnumSimple)).toEqual({
      __root: {
        __name: '__root',
        __path: '__root',
        __type: 'enum_option',
        __select: true,
        __fields: {
          [`__field-0`]: {
            type: 'String',
            name: '__root.__field-0',
            label: '__field-0',
          },
          __null: {
            name: '__root.__null',
            label: '__null',
            type: 'Null',
          },
        },
      },
      __values: {
        [`__field-0`]: '',
        __null: 'Null',
      },
    });
  });

  it('option enum with fields object', () => {
    expect(parseMeta(optionEnumWithFieldsObject)).toEqual({
      __root: {
        __name: '__root',
        __path: '__root',
        __type: 'enum_option',
        __select: true,
        __fields: {
          ['__field-0']: {
            __fields: {
              firstName: {
                label: 'firstName',
                name: '__root.__field-0.firstName',
                type: 'Text',
              },
              lastName: {
                label: 'lastName',
                name: '__root.__field-0.lastName',
                type: 'Text',
              },
            },
            __name: '__field-0',
            __path: '__root.__field-0',
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
        '__field-0': {
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
        __path: '__root',
        __type: '__fieldset',
        __select: false,
        __fields: {
          field: {
            __name: 'field',
            __path: '__root.field',
            __type: 'enum_option',
            __select: true,
            __fields: {
              [`__field-0`]: {
                type: 'String',
                name: '__root.field.__field-0',
                label: '__field-0',
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
          [`__field-0`]: '',
          __null: 'Null',
        },
      },
    });
  });

  it('with complex option enum', () => {
    expect(parseMeta(optionEnumComplex)).toEqual({
      __root: {
        __name: '__root',
        __path: '__root',
        __type: '__fieldset',
        __select: false,
        __fields: {
          res: {
            __fields: {
              '__field-0': {
                __fields: {
                  id: {
                    __fields: {
                      decimal: {
                        label: 'decimal',
                        name: '__root.res.__field-0.id.decimal',
                        type: 'u64',
                      },
                      hex: {
                        label: 'hex',
                        name: '__root.res.__field-0.id.hex',
                        type: 'Bytes',
                      },
                    },
                    __name: 'id',
                    __path: '__root.res.__field-0.id',
                    __select: false,
                    __type: '__fieldset',
                  },
                  person: {
                    __fields: {
                      name: {
                        label: 'name',
                        name: '__root.res.__field-0.person.name',
                        type: 'Text',
                      },
                      surname: {
                        label: 'surname',
                        name: '__root.res.__field-0.person.surname',
                        type: 'Text',
                      },
                    },
                    __name: 'person',
                    __path: '__root.res.__field-0.person',
                    __select: false,
                    __type: '__fieldset',
                  },
                },
                __name: '__field-0',
                __path: '__root.res.__field-0',
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
            __path: '__root.res',
            __select: true,
            __type: 'enum_option',
          },
        },
      },
      __values: {
        res: {
          '__field-0': {
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
        __path: '__root',
        __type: '__fieldset',
        __select: false,
        __fields: {
          exchangeRate: {
            __name: 'exchangeRate',
            __path: '__root.exchangeRate',
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
                  '__field-0': {
                    label: '__field-0',
                    name: '__root.exchangeRate.err.__field-0',
                    type: 'String',
                  },
                  __null: {
                    label: '__null',
                    name: '__root.exchangeRate.err.__null',
                    type: 'Null',
                  },
                },
                __name: 'err',
                __path: '__root.exchangeRate.err',
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
                __path: '__root.exchangeRate.ok',
                __select: false,
                __type: '__fieldset',
              },
            },
            __name: 'exchangeRate',
            __path: '__root.exchangeRate',
            __select: true,
            __type: 'enum_result',
          },
        },
        __name: '__root',
        __path: '__root',
        __select: false,
        __type: '__fieldset',
      },
      __values: {
        exchangeRate: {
          err: {
            '__field-0': '',
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
