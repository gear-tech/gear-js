import { parseMeta } from './meta-parser';

import {
  simpleDeepStruct,
  simpleStruct,
  simpleEnum,
  simpleEnumOption,
  complexEnumOption,
  simpleEnumResult,
} from './meta-fixtures';

// result
// 1. OK
// 2. Err

// option
// 1. null
// 2. type

// enum custom fields from select

describe('test parser', () => {
  // it("empty array", () => {
  //     expect(parseMeta([])).toEqual(null);
  // });
  //
  // it("empty object", () => {
  //     expect(parseMeta({})).toEqual(null);
  // });

  // it("array of simple structs", () => {
  //     expect(parseMeta(data5)).toEqual({
  //         select: null,
  //         fields: [
  //             {
  //                 AddMessage: {
  //                     type: "Text",
  //                     name: "author",
  //                 }
  //             },
  //             {
  //                 AddMessage: {
  //                     type: "Text",
  //                     name: "author",
  //                 }
  //             },
  //         ]
  //     });
  // });

  it('simple struct', () => {
    expect(parseMeta(simpleStruct)).toEqual({
      select: null,
      fields: {
        AddMessage: {
          author: {
            label: 'author',
            type: 'Text',
            name: 'fields.AddMessage.author',
            value: '',
          },
          msg: {
            label: 'msg',
            type: 'Text',
            name: 'fields.AddMessage.msg',
            value: '',
          },
        },
      },
    });
  });

  it('simple deep struct', () => {
    expect(parseMeta(simpleDeepStruct)).toEqual({
      select: null,
      fields: {
        AddMessage: {
          To: {
            name: {
              type: 'Text',
              name: 'fields.AddMessage.To.name',
              label: 'name',
              value: '',
            },
            from: {
              type: 'Text',
              name: 'fields.AddMessage.To.from',
              label: 'from',
              value: '',
            },
          },
          author: {
            type: 'Text',
            name: 'fields.AddMessage.author',
            label: 'author',
            value: '',
          },
          msg: {
            type: 'Text',
            name: 'fields.AddMessage.msg',
            label: 'msg',
            value: '',
          },
        },
      },
    });
  });

  it('simple enum', () => {
    expect(parseMeta(simpleEnum)).toEqual({
      select: {
        'AddMessage.Post.ViewMessages': {
          type: '_enum',
          fields: {
            AddMessage: {
              author: {
                type: 'Text',
                name: 'fields.AddMessage.author',
                label: 'author',
                value: '',
              },
              msg: {
                type: 'Text',
                name: 'fields.AddMessage.msg',
                label: 'msg',
                value: '',
              },
            },
            Post: {
              type: 'Text',
              name: 'fields.Post',
              label: 'Post',
              value: '',
            },
            ViewMessages: {
              type: 'Null',
              name: 'fields.ViewMessages',
              label: 'ViewMessages',
              value: 'Null',
            },
          },
        },
      },
      fields: {
        AddMessage: {
          author: {
            type: 'Text',
            name: 'fields.AddMessage.author',
            label: 'author',
            value: '',
          },
          msg: {
            type: 'Text',
            name: 'fields.AddMessage.msg',
            label: 'msg',
            value: '',
          },
        },
      },
    });
  });

  it('with simple option enum', () => {
    expect(parseMeta(simpleEnumOption)).toEqual({
      select: {
        field: {
          type: '_enum_Option',
          fields: {
            field: {
              type: 'String',
              name: 'fields.field',
              label: 'field',
              value: '',
            },
          },
          NoFields: {
            value: 'Null',
            name: 'fields.NoFields',
            label: 'NoFields',
            type: 'Null',
          },
        },
      },
      fields: null,
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
                name: 'fields.id.decimal',
                label: 'decimal',
                value: '',
              },
              hex: {
                type: 'Bytes',
                name: 'fields.id.hex',
                label: 'hex',
                value: '',
              },
            },
            person: {
              surname: {
                type: 'Text',
                name: 'fields.person.surname',
                label: 'surname',
                value: '',
              },
              name: {
                type: 'Text',
                name: 'fields.person.name',
                label: 'name',
                value: '',
              },
            },
          },
          NoFields: {
            value: 'Null',
            name: 'fields.NoFields',
            label: 'NoFields',
            type: 'Null',
          },
        },
      },
      fields: null,
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
              name: 'fields.exchangeRate.ok',
              label: 'ok',
              value: '',
            },
            err: {
              type: 'u8',
              name: 'fields.exchangeRate.err',
              label: 'err',
              value: '',
            },
          },
        },
      },
      fields: null,
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
              name: 'fields.exchangeRate.ok',
              label: 'ok',
            },
            err: {
              type: 'u8',
              name: 'fields.exchangeRate.err',
              label: 'err',
            },
          },
        },
      },
      fields: null,
    });
  });
});
