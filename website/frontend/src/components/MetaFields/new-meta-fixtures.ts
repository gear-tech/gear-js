import { MetaItem } from './new-meta-parser';

export const Primitive = {
  type: 'Primitive',
  name: 'String',
  value: 'String',
} as MetaItem;

export const PrimitiveResult = {
  __root: {
    __fields: {
      label: 'String',
      name: '__root',
      type: 'String',
    },
    __name: '__root',
    __path: '__root',
    __select: false,
    __type: '__fieldset',
  },
  __values: '',
};

export const BTreeMap = {
  type: 'BTreeMap',
  name: 'BTreeMap<String, u8>',
  value: {
    key: {
      type: 'Primitive',
      name: 'String',
      value: 'String',
    },
    value: {
      type: 'Primitive',
      name: 'u8',
      value: 'u8',
    },
  },
} as MetaItem;

export const BTreeMapResult = {
  __root: {
    __fields: {
      'BTreeMap<String, u8>': {
        __fields: {
          key: {
            label: 'key',
            name: '__root.BTreeMap<String, u8>.key',
            type: 'String',
          },
          value: {
            label: 'value',
            name: '__root.BTreeMap<String, u8>.value',
            type: 'u8',
          },
        },
        __name: 'BTreeMap<String, u8>',
        __path: '__root.BTreeMap<String, u8>',
        __select: false,
        __type: '__fieldset',
      },
    },
    __name: '__root',
    __path: '__root',
    __select: false,
    __type: '__fieldset',
  },
  __values: {
    'BTreeMap<String, u8>': {
      key: '',
      value: '',
    },
  },
};

export const BTreeSet = {
  type: 'BTreeSet',
  name: 'BTreeSet<u8>',
  value: {
    type: 'Primitive',
    name: 'u8',
    value: 'u8',
  },
} as MetaItem;

export const BTreeSetResult = {
  __root: {
    __fields: {
      'BTreeSet<u8>': {
        label: 'BTreeSet<u8>',
        name: '__root.BTreeSet<u8>',
        type: 'u8',
      },
    },
    __name: '__root',
    __path: '__root',
    __select: false,
    __type: '__fieldset',
  },
  __values: {
    'BTreeSet<u8>': '',
  },
};

export const StructSet = {
  type: 'Struct',
  name: 'AStruct',
  value: {
    id: { type: 'Primitive', name: 'Bytes', value: 'Bytes' },
    online: { type: 'Primitive', name: 'bool', value: 'bool' },
  },
} as MetaItem;

export const StructSetResult = {
  __root: {
    __type: '__fieldset',
    __name: '__root',
    __path: '__root',
    __select: false,
    __fields: {
      AStruct: {
        __type: '__fieldset',
        __name: 'AStruct',
        __path: '__root.AStruct',
        __select: false,
        __fields: {
          id: {
            label: 'id',
            type: 'Bytes',
            name: '__root.AStruct.id',
          },
          online: {
            label: 'online',
            type: 'bool',
            name: '__root.AStruct.online',
          },
        },
      },
    },
  },
  __values: {
    AStruct: {
      id: '',
      online: '',
    },
  },
};

export const StructField = {
  type: 'Struct',
  name: 'AStruct',
  value: { type: 'Primitive', name: 'Bytes', value: 'Bytes' },
} as MetaItem;

export const StructFieldResult = {
  __root: {
    __type: '__fieldset',
    __name: '__root',
    __path: '__root',
    __select: false,
    __fields: {
      AStruct: {
        type: 'Bytes',
        name: '__root.AStruct',
        label: 'AStruct',
      },
    },
  },
  __values: {
    AStruct: '',
  },
};

export const Enum = {
  type: 'Enum',
  name: 'Action',
  value: {
    AVariant: {
      type: 'Struct',
      name: 'AStruct',
      value: {
        id: { type: 'Primitive', name: 'Bytes', value: 'Bytes' },
        online: { type: 'Primitive', name: 'bool', value: 'bool' },
      },
    },
    BVar: {
      type: 'Option',
      name: 'BVar',
      value: {
        type: 'Struct',
        name: 'CustomStructU8',
        value: { field: { type: 'Primitive', name: 'u8', value: 'u8' } },
      },
    },
    CVariant: {
      type: 'BTreeMap',
      name: 'BTreeMap<Text, u8>',
      value: {
        key: { type: 'Primitive', name: 'Text', value: 'Text' },
        value: { type: 'Primitive', name: 'u8', value: 'u8' },
      },
    },
  },
} as MetaItem;

export const EnumResult = {
  __root: {
    __type: '__fieldset',
    __name: '__root',
    __path: '__root',
    __select: false,
    __fields: {
      Action: {
        __type: '__fieldset',
        __name: 'Action',
        __path: '__root.Action',
        __select: true,
        __fields: {
          AVariant: {
            __fields: {
              id: {
                label: 'id',
                name: '__root.Action.AVariant.id',
                type: 'Bytes',
              },
              online: {
                label: 'online',
                name: '__root.Action.AVariant.online',
                type: 'bool',
              },
            },
            __name: 'AVariant',
            __path: '__root.Action.AVariant',
            __select: false,
            __type: '__fieldset',
          },
          BVar: {
            __type: '__fieldset',
            __name: 'BVar',
            __path: '__root.Action.BVar',
            __select: true,
            __fields: {
              CustomStructU8: {
                __type: '__fieldset',
                __name: 'CustomStructU8',
                __path: '__root.Action.BVar.CustomStructU8',
                __select: false,
                __fields: {
                  field: {
                    label: 'field',
                    type: 'u8',
                    name: '__root.Action.BVar.CustomStructU8.field',
                  },
                },
              },
              None: {
                label: 'None',
                type: 'None',
                name: '__root.Action.BVar.None',
              },
            },
          },
          CVariant: {
            __type: '__fieldset',
            __name: 'CVariant',
            __path: '__root.Action.CVariant',
            __select: false,
            __fields: {
              key: {
                label: 'key',
                name: '__root.Action.CVariant.key',
                type: 'Text',
              },
              value: {
                label: 'value',
                name: '__root.Action.CVariant.value',
                type: 'u8',
              },
            },
          },
        },
      },
    },
  },
  __values: {
    Action: {
      AVariant: {
        id: '',
        online: '',
      },
      BVar: {
        CustomStructU8: {
          field: '',
        },
        None: 'None',
      },
      CVariant: {
        key: '',
        value: '',
      },
    },
  },
};

export const Option = {
  type: 'Option',
  name: 'Option<AStruct>',
  value: {
    type: 'Struct',
    name: 'AStruct',
    value: {
      id: { type: 'Primitive', name: 'Bytes', value: 'Bytes' },
      online: { type: 'Primitive', name: 'bool', value: 'bool' },
    },
  },
} as MetaItem;

export const OptionResult = {
  __root: {
    __type: '__fieldset',
    __name: '__root',
    __path: '__root',
    __select: false,
    __fields: {
      'Option<AStruct>': {
        __fields: {
          AStruct: {
            __fields: {
              id: {
                label: 'id',
                name: '__root.Option<AStruct>.AStruct.id',
                type: 'Bytes',
              },
              online: {
                label: 'online',
                name: '__root.Option<AStruct>.AStruct.online',
                type: 'bool',
              },
            },
            __name: 'AStruct',
            __path: '__root.Option<AStruct>.AStruct',
            __select: false,
            __type: '__fieldset',
          },
          None: {
            label: 'None',
            name: '__root.Option<AStruct>.None',
            type: 'None',
          },
        },
        __name: 'Option<AStruct>',
        __path: '__root.Option<AStruct>',
        __select: true,
        __type: '__fieldset',
      },
    },
  },
  __values: {
    'Option<AStruct>': {
      AStruct: {
        id: '',
        online: '',
      },
      None: 'None',
    },
  },
};

export const VecField = {
  type: 'Vec',
  name: 'Vec<u8>',
  value: { type: 'Primitive', name: 'u8', value: 'u8' },
} as MetaItem;

export const VecFieldResult = {
  __root: {
    __type: '__fieldset',
    __name: '__root',
    __path: '__root',
    __select: false,
    __fields: {
      'Vec<u8>': {
        type: 'u8',
        name: '__root.Vec<u8>',
        label: 'Vec<u8>',
      },
    },
  },
  __values: {
    'Vec<u8>': '',
  },
};

export const VecSet = {
  type: 'Vec',
  name: 'Vec<MessageIn>',
  value: {
    type: 'Struct',
    name: 'MessageIn',
    value: {
      id: {
        type: 'Struct',
        name: 'Id',
        value: {
          decimal: {
            type: 'Primitive',
            name: 'u64',
            value: 'u64',
          },
          hex: {
            type: 'Primitive',
            name: 'Bytes',
            value: 'Bytes',
          },
        },
      },
    },
  },
} as MetaItem;

export const VecSetResult = {
  __root: {
    __fields: {
      'Vec<MessageIn>': {
        label: 'Vec<MessageIn>',
        name: '__root.Vec<MessageIn>',
        type: 'MessageIn',
      },
    },
    __name: '__root',
    __path: '__root',
    __select: false,
    __type: '__fieldset',
  },
  __values: {
    'Vec<MessageIn>': '',
  },
};

export const Result = {
  type: 'Result',
  name: 'Result<String, i32>',
  value: {
    ok: { type: 'Primitive', name: 'String', value: 'String' },
    err: { type: 'Primitive', name: 'i32', value: 'i32' },
  },
} as MetaItem;

export const ResultResult = {
  __root: {
    __type: '__fieldset',
    __name: '__root',
    __path: '__root',
    __select: false,
    __fields: {
      'Result<String, i32>': {
        __type: '__fieldset',
        __name: 'Result<String, i32>',
        __path: '__root.Result<String, i32>',
        __select: true,
        __fields: {
          ok: {
            label: 'ok',
            type: 'String',
            name: '__root.Result<String, i32>.ok',
          },
          err: {
            label: 'err',
            type: 'i32',
            name: '__root.Result<String, i32>.err',
          },
        },
      },
    },
  },
  __values: {
    'Result<String, i32>': {
      ok: '',
      err: '',
    },
  },
};

export const ResultComplex = {
  type: 'Result',
  name: 'Result<MessageIn, Id>',
  value: {
    ok: {
      type: 'Struct',
      name: 'MessageIn',
      value: {
        id: {
          type: 'Struct',
          name: 'Id',
          value: {
            decimal: {
              type: 'Primitive',
              name: 'u64',
              value: 'u64',
            },
            hex: {
              type: 'Primitive',
              name: 'Bytes',
              value: 'Bytes',
            },
          },
        },
      },
    },
    err: {
      type: 'Struct',
      name: 'Id',
      value: {
        decimal: {
          type: 'Primitive',
          name: 'u64',
          value: 'u64',
        },
        hex: {
          type: 'Primitive',
          name: 'Bytes',
          value: 'Bytes',
        },
      },
    },
  },
} as MetaItem;

export const ResultComplexResult = {
  __root: {
    __fields: {
      'Result<MessageIn, Id>': {
        __fields: {
          err: {
            __fields: {
              decimal: {
                label: 'decimal',
                name: '__root.Result<MessageIn, Id>.err.decimal',
                type: 'u64',
              },
              hex: {
                label: 'hex',
                name: '__root.Result<MessageIn, Id>.err.hex',
                type: 'Bytes',
              },
            },
            __name: 'err',
            __path: '__root.Result<MessageIn, Id>.err',
            __select: false,
            __type: '__fieldset',
          },
          ok: {
            __fields: {
              id: {
                __fields: {
                  decimal: {
                    label: 'decimal',
                    name: '__root.Result<MessageIn, Id>.ok.id.decimal',
                    type: 'u64',
                  },
                  hex: {
                    label: 'hex',
                    name: '__root.Result<MessageIn, Id>.ok.id.hex',
                    type: 'Bytes',
                  },
                },
                __name: 'id',
                __path: '__root.Result<MessageIn, Id>.ok.id',
                __select: false,
                __type: '__fieldset',
              },
            },
            __name: 'ok',
            __path: '__root.Result<MessageIn, Id>.ok',
            __select: false,
            __type: '__fieldset',
          },
        },
        __name: 'Result<MessageIn, Id>',
        __path: '__root.Result<MessageIn, Id>',
        __select: true,
        __type: '__fieldset',
      },
    },
    __name: '__root',
    __path: '__root',
    __select: false,
    __type: '__fieldset',
  },
  __values: {
    'Result<MessageIn, Id>': {
      err: {
        decimal: '',
        hex: '',
      },
      ok: {
        id: {
          decimal: '',
          hex: '',
        },
      },
    },
  },
};

export const Tuple = {
  type: 'Tuple',
  name: '(String, u8)',
  value: [
    {
      type: 'Primitive',
      name: 'String',
      value: 'String',
    },
    {
      type: 'Primitive',
      name: 'u8',
      value: 'u8',
    },
  ],
} as MetaItem;

export const TupleResult = {
  __root: {
    __fields: {
      '(String, u8)': {
        __fields: {
          String: {
            label: 'String',
            name: '__root.(String, u8).String',
            type: 'String',
          },
          u8: {
            label: 'u8',
            name: '__root.(String, u8).u8',
            type: 'u8',
          },
        },
        __name: '(String, u8)',
        __path: '__root.(String, u8)',
        __select: false,
        __type: '__fieldset',
      },
    },
    __name: '__root',
    __path: '__root',
    __select: false,
    __type: '__fieldset',
  },
  __values: {
    '(String, u8)': {
      String: '',
      u8: '',
    },
  },
};

export const Array = {
  type: 'Array',
  name: '[u8;4]',
  value: {
    type: 'Primitive',
    name: 'u8',
    value: 'u8',
  },
} as MetaItem;

export const ArrayResult = {
  __root: {
    __fields: {
      '[u8;4]': {
        label: '[u8;4]',
        name: '__root.[u8;4]',
        type: 'u8',
      },
    },
    __name: '__root',
    __path: '__root',
    __select: false,
    __type: '__fieldset',
  },
  __values: {
    '[u8;4]': '',
  },
};

export const FungibleTokenAction = {
  type: 'Enum',
  name: 'FungibleTokenAction',
  value: {
    Mint: { type: 'Primitive', name: 'u128', value: 'u128' },
    Burn: { type: 'Primitive', name: 'u128', value: 'u128' },
    Transfer: {
      type: 'Struct',
      name: '{"from":"ActorId","to":"ActorId","amount":"u128"}',
      value: {
        from: { type: 'Primitive', name: 'ActorId', value: 'ActorId' },
        to: { type: 'Primitive', name: 'ActorId', value: 'ActorId' },
        amount: { type: 'Primitive', name: 'u128', value: 'u128' },
      },
    },
    Approve: {
      type: 'Struct',
      name: '{"to":"ActorId","amount":"u128"}',
      value: {
        to: { type: 'Primitive', name: 'ActorId', value: 'ActorId' },
        amount: { type: 'Primitive', name: 'u128', value: 'u128' },
      },
    },
    TotalSupply: { type: 'Primitive', name: 'Null', value: 'Null' },
    BalanceOf: {
      type: 'Primitive',
      name: 'ActorId',
      value: 'ActorId',
    },
  },
} as MetaItem;

export const FungibleTokenActionResult = {
  __root: {
    __fields: {
      FungibleTokenAction: {
        __fields: {
          Approve: {
            __fields: {
              amount: {
                label: 'amount',
                name: '__root.FungibleTokenAction.Approve.amount',
                type: 'u128',
              },
              to: {
                label: 'to',
                name: '__root.FungibleTokenAction.Approve.to',
                type: 'ActorId',
              },
            },
            __name: 'Approve',
            __path: '__root.FungibleTokenAction.Approve',
            __select: false,
            __type: '__fieldset',
          },
          BalanceOf: {
            label: 'BalanceOf',
            name: '__root.FungibleTokenAction.BalanceOf',
            type: 'ActorId',
          },
          Burn: {
            label: 'Burn',
            name: '__root.FungibleTokenAction.Burn',
            type: 'u128',
          },
          Mint: {
            label: 'Mint',
            name: '__root.FungibleTokenAction.Mint',
            type: 'u128',
          },
          TotalSupply: {
            label: 'TotalSupply',
            name: '__root.FungibleTokenAction.TotalSupply',
            type: 'Null',
          },
          Transfer: {
            __fields: {
              amount: {
                label: 'amount',
                name: '__root.FungibleTokenAction.Transfer.amount',
                type: 'u128',
              },
              from: {
                label: 'from',
                name: '__root.FungibleTokenAction.Transfer.from',
                type: 'ActorId',
              },
              to: {
                label: 'to',
                name: '__root.FungibleTokenAction.Transfer.to',
                type: 'ActorId',
              },
            },
            __name: 'Transfer',
            __path: '__root.FungibleTokenAction.Transfer',
            __select: false,
            __type: '__fieldset',
          },
        },
        __name: 'FungibleTokenAction',
        __path: '__root.FungibleTokenAction',
        __select: true,
        __type: '__fieldset',
      },
    },
    __name: '__root',
    __path: '__root',
    __select: false,
    __type: '__fieldset',
  },
  __values: {
    FungibleTokenAction: {
      Approve: {
        amount: '',
        to: '',
      },
      BalanceOf: '',
      Burn: '',
      Mint: '',
      TotalSupply: '',
      Transfer: {
        amount: '',
        from: '',
        to: '',
      },
    },
  },
};

export const NFT = {
  type: 'Enum',
  name: 'NftAction',
  value: {
    Mint: {
      type: 'Struct',
      name: '{"tokenMetadata":"TokenMetadata"}',
      value: {
        tokenMetadata: {
          type: 'Struct',
          name: 'TokenMetadata',
          value: {
            name: {
              type: 'Primitive',
              name: 'Text',
              value: 'Text',
            },
            description: {
              type: 'Primitive',
              name: 'Text',
              value: 'Text',
            },
            media: {
              type: 'Primitive',
              name: 'Text',
              value: 'Text',
            },
            reference: {
              type: 'Primitive',
              name: 'Text',
              value: 'Text',
            },
          },
        },
      },
    },
    Burn: {
      type: 'Struct',
      name: '{"tokenId":"U256"}',
      value: {
        tokenId: {
          type: 'Primitive',
          name: 'U256',
          value: 'U256',
        },
      },
    },
    Transfer: {
      type: 'Struct',
      name: '{"to":"ActorId","tokenId":"U256"}',
      value: {
        to: {
          type: 'Primitive',
          name: 'ActorId',
          value: 'ActorId',
        },
        tokenId: {
          type: 'Primitive',
          name: 'U256',
          value: 'U256',
        },
      },
    },
    Approve: {
      type: 'Struct',
      name: '{"to":"ActorId","tokenId":"U256"}',
      value: {
        to: {
          type: 'Primitive',
          name: 'ActorId',
          value: 'ActorId',
        },
        tokenId: {
          type: 'Primitive',
          name: 'U256',
          value: 'U256',
        },
      },
    },
  },
} as MetaItem;

export const NFTResult = {
  __root: {
    __fields: {
      NftAction: {
        __fields: {
          Approve: {
            __fields: {
              to: {
                label: 'to',
                name: '__root.NftAction.Approve.to',
                type: 'ActorId',
              },
              tokenId: {
                label: 'tokenId',
                name: '__root.NftAction.Approve.tokenId',
                type: 'U256',
              },
            },
            __name: 'Approve',
            __path: '__root.NftAction.Approve',
            __select: false,
            __type: '__fieldset',
          },
          Burn: {
            __fields: {
              tokenId: {
                label: 'tokenId',
                name: '__root.NftAction.Burn.tokenId',
                type: 'U256',
              },
            },
            __name: 'Burn',
            __path: '__root.NftAction.Burn',
            __select: false,
            __type: '__fieldset',
          },
          Mint: {
            __fields: {
              tokenMetadata: {
                __fields: {
                  description: {
                    label: 'description',
                    name: '__root.NftAction.Mint.tokenMetadata.description',
                    type: 'Text',
                  },
                  media: {
                    label: 'media',
                    name: '__root.NftAction.Mint.tokenMetadata.media',
                    type: 'Text',
                  },
                  name: {
                    label: 'name',
                    name: '__root.NftAction.Mint.tokenMetadata.name',
                    type: 'Text',
                  },
                  reference: {
                    label: 'reference',
                    name: '__root.NftAction.Mint.tokenMetadata.reference',
                    type: 'Text',
                  },
                },
                __name: 'tokenMetadata',
                __path: '__root.NftAction.Mint.tokenMetadata',
                __select: false,
                __type: '__fieldset',
              },
            },
            __name: 'Mint',
            __path: '__root.NftAction.Mint',
            __select: false,
            __type: '__fieldset',
          },
          Transfer: {
            __fields: {
              to: {
                label: 'to',
                name: '__root.NftAction.Transfer.to',
                type: 'ActorId',
              },
              tokenId: {
                label: 'tokenId',
                name: '__root.NftAction.Transfer.tokenId',
                type: 'U256',
              },
            },
            __name: 'Transfer',
            __path: '__root.NftAction.Transfer',
            __select: false,
            __type: '__fieldset',
          },
        },
        __name: 'NftAction',
        __path: '__root.NftAction',
        __select: true,
        __type: '__fieldset',
      },
    },
    __name: '__root',
    __path: '__root',
    __select: false,
    __type: '__fieldset',
  },
  __values: {
    NftAction: {
      Approve: {
        to: '',
        tokenId: '',
      },
      Burn: {
        tokenId: '',
      },
      Mint: {
        tokenMetadata: {
          description: '',
          media: '',
          name: '',
          reference: '',
        },
      },
      Transfer: {
        to: '',
        tokenId: '',
      },
    },
  },
};
