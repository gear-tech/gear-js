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
          },
          msg: {
            label: 'msg',
            type: 'Text',
            name: 'fields.AddMessage.msg',
          },
        },
      },
      values: {
        AddMessage: {
          author: '',
          msg: '',
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
            },
            from: {
              type: 'Text',
              name: 'fields.AddMessage.To.from',
              label: 'from',
            },
          },
          author: {
            type: 'Text',
            name: 'fields.AddMessage.author',
            label: 'author',
          },
          msg: {
            type: 'Text',
            name: 'fields.AddMessage.msg',
            label: 'msg',
          },
        },
      },
      values: {
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
      select: {
        'AddMessage.Post.ViewMessages': {
          type: '_enum',
          fields: {
            AddMessage: {
              author: {
                type: 'Text',
                name: 'fields.AddMessage.author',
                label: 'author',
              },
              msg: {
                type: 'Text',
                name: 'fields.AddMessage.msg',
                label: 'msg',
              },
            },
            Post: {
              type: 'Text',
              name: 'fields.Post',
              label: 'Post',
            },
            ViewMessages: {
              type: 'Null',
              name: 'fields.ViewMessages',
              label: 'ViewMessages',
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
          },
          msg: {
            type: 'Text',
            name: 'fields.AddMessage.msg',
            label: 'msg',
          },
        },
      },
      values: {
        AddMessage: {
          author: '',
          msg: '',
        },
        Post: '',
        ViewMessages: null,
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
            },
          },
          NoFields: {
            name: 'fields.NoFields',
            label: 'NoFields',
            type: 'Null',
          },
        },
      },
      fields: {
        field: {
          type: 'String',
          name: 'fields.field',
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
                name: 'fields.id.decimal',
                label: 'decimal',
              },
              hex: {
                type: 'Bytes',
                name: 'fields.id.hex',
                label: 'hex',
              },
            },
            person: {
              surname: {
                type: 'Text',
                name: 'fields.person.surname',
                label: 'surname',
              },
              name: {
                type: 'Text',
                name: 'fields.person.name',
                label: 'name',
              },
            },
          },
          NoFields: {
            name: 'fields.NoFields',
            label: 'NoFields',
            type: 'Null',
          },
        },
      },
      fields: {
        id: {
          decimal: {
            type: 'u64',
            name: 'fields.id.decimal',
            label: 'decimal',
          },
          hex: {
            type: 'Bytes',
            name: 'fields.id.hex',
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
      fields: {
        ok: {
          type: 'u8',
          name: 'fields.exchangeRate.ok',
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
      fields: {
        ok: {
          label: 'ok',
          name: 'fields.exchangeRate.ok',
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
