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
            name: 'AddMessage.author',
          },
          msg: {
            label: 'msg',
            type: 'Text',
            name: 'AddMessage.msg',
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
              name: 'AddMessage.To.name',
              label: 'name',
            },
            from: {
              type: 'Text',
              name: 'AddMessage.To.from',
              label: 'from',
            },
          },
          author: {
            type: 'Text',
            name: 'AddMessage.author',
            label: 'author',
          },
          msg: {
            type: 'Text',
            name: 'AddMessage.msg',
            label: 'msg',
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
              author: { type: 'Text', name: 'AddMessage.author', label: 'author' },
              msg: { type: 'Text', name: 'AddMessage.msg', label: 'msg' },
            },
            Post: {
              type: 'Text',
              name: 'Post',
              label: 'Post',
            },
            ViewMessages: {
              ViewMessages: null, // means no input
            },
          },
        },
      },
      fields: null,
    });
  });

  it('with simple option enum', () => {
    expect(parseMeta(simpleEnumOption)).toEqual({
      select: {
        field: {
          type: '_enum_Option',
          fields: {
            field: { type: 'String', name: 'field', label: 'field' },
          },
          NoFields: {
            NoFields: null,
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
                name: 'id.decimal',
                label: 'decimal',
              },
              hex: {
                type: 'Bytes',
                name: 'id.hex',
                label: 'hex',
              },
            },
            person: {
              surname: {
                type: 'Text',
                name: 'person.surname',
                label: 'surname',
              },
              name: {
                type: 'Text',
                name: 'person.name',
                label: 'name',
              },
            },
          },
          NoFields: {
            NoFields: null,
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
              name: 'exchangeRate.ok',
              label: 'ok',
            },
            err: {
              type: 'u8',
              name: 'exchangeRate.err',
              label: 'err',
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
              name: 'exchangeRate.ok',
              label: 'ok',
            },
            err: {
              type: 'u8',
              name: 'exchangeRate.err',
              label: 'err',
            },
          },
        },
      },
      fields: null,
    });
  });
});
