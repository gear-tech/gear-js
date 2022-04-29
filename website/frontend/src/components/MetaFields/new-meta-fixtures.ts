export const Primitive = {
  type: 'Primitive',
  name: 'String',
  value: 'String',
};

export const PrimitiveResult = {
  __root: {
    __type: '__fieldset',
    __name: '__root',
    __path: '__root',
    __select: false,
    __fields: {
      String: {
        label: 'String',
        type: 'String',
        name: '__root.String',
      },
    },
  },
  __values: {
    String: '',
  },
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
};

export const BTreeMapResult = {
  __root: {
    __fields: {
      'BTreeMap<String, u8>': {
        __fields: {
          String: {
            label: 'String',
            name: '__root.BTreeMap<String, u8>.String',
            type: 'String',
          },
          u8: {
            label: 'u8',
            name: '__root.BTreeMap<String, u8>.u8',
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
      String: '',
      u8: '',
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
};

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

export const Struct = {
  type: 'Struct',
  name: 'AStruct',
  value: {
    id: { type: 'Primitive', name: 'Bytes', value: 'Bytes' },
    online: { type: 'Primitive', name: 'bool', value: 'bool' },
  },
};

export const StructResult = {
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
      name: 'Option<CustomStructU8>',
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
};

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
          AStruct: {
            __type: '__fieldset',
            __name: 'AStruct',
            __path: '__root.Action.AStruct',
            __select: false,
            __fields: {
              id: {
                label: 'id',
                type: 'Bytes',
                name: '__root.Action.AStruct.id',
              },
              online: {
                label: 'online',
                type: 'bool',
                name: '__root.Action.AStruct.online',
              },
            },
          },
          'Option<CustomStructU8>': {
            __type: '__fieldset',
            __name: 'Option<CustomStructU8>',
            __path: '__root.Action.Option<CustomStructU8>',
            __select: true,
            __fields: {
              CustomStructU8: {
                __type: '__fieldset',
                __name: 'CustomStructU8',
                __path: '__root.Action.Option<CustomStructU8>.CustomStructU8',
                __select: false,
                __fields: {
                  field: {
                    label: 'field',
                    type: 'u8',
                    name: '__root.Action.Option<CustomStructU8>.CustomStructU8.field',
                  },
                },
              },
              None: {
                label: 'None',
                type: 'None',
                name: '__root.Action.Option<CustomStructU8>.None',
              },
            },
          },
          'BTreeMap<Text, u8>': {
            __type: '__fieldset',
            __name: 'BTreeMap<Text, u8>',
            __path: '__root.Action.BTreeMap<Text, u8>',
            __select: false,
            __fields: {
              Text: {
                label: 'Text',
                name: '__root.Action.BTreeMap<Text, u8>.Text',
                type: 'Text',
              },
              u8: {
                label: 'u8',
                name: '__root.Action.BTreeMap<Text, u8>.u8',
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
      AStruct: {
        id: '',
        online: '',
      },
      'BTreeMap<Text, u8>': {
        Text: '',
        u8: '',
      },
      'Option<CustomStructU8>': {
        CustomStructU8: {
          field: '',
        },
        None: 'None',
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
};

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

export const Vec = {
  type: 'Vec',
  name: 'Vec<u8>',
  value: { type: 'Primitive', name: 'u8', value: 'u8' },
};

export const VecResult = {
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

export const Result = {
  type: 'Result',
  name: 'Result<String, i32>',
  value: {
    ok: { type: 'Primitive', name: 'String', value: 'String' },
    err: { type: 'Primitive', name: 'i32', value: 'i32' },
  },
};

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
};

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
};

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
};

export const FungibleTokenActionResult = {
  __root: {
    __fields: {
      FungibleTokenAction: {
        __fields: {
          ActorId: {
            label: 'ActorId',
            name: '__root.FungibleTokenAction.ActorId',
            type: 'ActorId',
          },
          Null: {
            label: 'Null',
            name: '__root.FungibleTokenAction.Null',
            type: 'Null',
          },
          u128: {
            label: 'u128',
            name: '__root.FungibleTokenAction.u128',
            type: 'u128',
          },
          '{"from":"ActorId","to":"ActorId","amount":"u128"}': {
            __fields: {
              amount: {
                label: 'amount',
                name: '__root.FungibleTokenAction.{"from":"ActorId","to":"ActorId","amount":"u128"}.amount',
                type: 'u128',
              },
              from: {
                label: 'from',
                name: '__root.FungibleTokenAction.{"from":"ActorId","to":"ActorId","amount":"u128"}.from',
                type: 'ActorId',
              },
              to: {
                label: 'to',
                name: '__root.FungibleTokenAction.{"from":"ActorId","to":"ActorId","amount":"u128"}.to',
                type: 'ActorId',
              },
            },
            __name: '{"from":"ActorId","to":"ActorId","amount":"u128"}',
            __path: '__root.FungibleTokenAction.{"from":"ActorId","to":"ActorId","amount":"u128"}',
            __select: false,
            __type: '__fieldset',
          },
          '{"to":"ActorId","amount":"u128"}': {
            __fields: {
              amount: {
                label: 'amount',
                name: '__root.FungibleTokenAction.{"to":"ActorId","amount":"u128"}.amount',
                type: 'u128',
              },
              to: {
                label: 'to',
                name: '__root.FungibleTokenAction.{"to":"ActorId","amount":"u128"}.to',
                type: 'ActorId',
              },
            },
            __name: '{"to":"ActorId","amount":"u128"}',
            __path: '__root.FungibleTokenAction.{"to":"ActorId","amount":"u128"}',
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
      ActorId: '',
      Null: '',
      u128: '',
      '{"from":"ActorId","to":"ActorId","amount":"u128"}': {
        amount: '',
        from: '',
        to: '',
      },
      '{"to":"ActorId","amount":"u128"}': {
        amount: '',
        to: '',
      },
    },
  },
};
