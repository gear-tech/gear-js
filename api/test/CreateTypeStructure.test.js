const { createPayloadTypeStructure } = require('../lib');

describe('Create type structure test', () => {
  let types;
  beforeAll(() => {
    types = {
      Action: {
        _enum: {
          AVariant: 'AStruct',
          BVar: 'Option<CustomStructU8>',
          CVariant: 'BTreeMap<Text, u8>',
        },
      },
      AStruct: { id: 'Bytes', online: 'bool' },
      CustomStructU8: { field: 'u8' },
      CustomStructOption: { field: 'Option<(Option<u8>,u128,[u8;3])>' },
      FungibleTokenAction: {
        _enum: {
          Mint: 'u128',
          Burn: 'u128',
          Transfer: '{"from":"ActorId","to":"ActorId","amount":"u128"}',
          Approve: '{"to":"ActorId","amount":"u128"}',
          TotalSupply: 'Null',
          BalanceOf: 'ActorId',
        },
      },
    };
  });
  test('Enum', () => {
    expect(createPayloadTypeStructure('Action', types)).toEqual({
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
    });
  });
  test('Struct', () => {
    expect(createPayloadTypeStructure('AStruct', types)).toEqual({
      type: 'Struct',
      name: 'AStruct',
      value: {
        id: { type: 'Primitive', name: 'Bytes', value: 'Bytes' },
        online: { type: 'Primitive', name: 'bool', value: 'bool' },
      },
    });
    expect(createPayloadTypeStructure('CustomStructU8', types)).toEqual({
      type: 'Struct',
      name: 'CustomStructU8',
      value: { field: { type: 'Primitive', name: 'u8', value: 'u8' } },
    });
    expect(createPayloadTypeStructure('CustomStructOption', types)).toEqual({
      type: 'Struct',
      name: 'CustomStructOption',
      value: {
        field: {
          type: 'Option',
          name: 'Option<(Option<u8>,u128,[u8;3])>',
          value: {
            type: 'Tuple',
            name: '(Option<u8>,u128,[u8;3])',
            value: [
              {
                type: 'Option',
                name: 'Option<u8>',
                value: {
                  type: 'Primitive',
                  name: 'u8',
                  value: 'u8',
                },
              },
              {
                type: 'Primitive',
                name: 'u128',
                value: 'u128',
              },
              {
                type: 'Array',
                name: '[u8;3]',
                value: {
                  type: 'Primitive',
                  name: 'u8',
                  value: 'u8',
                },
                count: 3,
              },
            ],
          },
        },
      },
    });
  });
  test('Vec', () => {
    expect(createPayloadTypeStructure('Vec<u8>', {})).toEqual({
      type: 'Vec',
      name: 'Vec<u8>',
      value: { type: 'Primitive', name: 'u8', value: 'u8' },
    });
  });
  test('Result', () => {
    expect(createPayloadTypeStructure('Result<String, i32>', {})).toEqual({
      type: 'Result',
      name: 'Result<String, i32>',
      value: {
        ok: { type: 'Primitive', name: 'String', value: 'String' },
        err: { type: 'Primitive', name: 'i32', value: 'i32' },
      },
    });
  });
  test('Primitive', () => {
    expect(createPayloadTypeStructure('String', {})).toEqual({
      type: 'Primitive',
      name: 'String',
      value: 'String',
    });
    expect(createPayloadTypeStructure('u64', {})).toEqual({
      type: 'Primitive',
      name: 'u64',
      value: 'u64',
    });
  });
  test('Tuple', () => {
    expect(createPayloadTypeStructure('(String, u8)', types)).toEqual({
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
    });
  });
  test('Array', () => {
    expect(createPayloadTypeStructure('[u8;4]', types)).toEqual({
      type: 'Array',
      name: '[u8;4]',
      value: {
        type: 'Primitive',
        name: 'u8',
        value: 'u8',
      },
      count: 4,
    });
  });
  test('Option', () => {
    expect(createPayloadTypeStructure('Option<AStruct>', types)).toEqual({
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
    });
  });
  test('BTreeMap', () => {
    expect(createPayloadTypeStructure('BTreeMap<String, u8>', types)).toEqual({
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
    });
  });
  test('BTreeSet', () => {
    expect(createPayloadTypeStructure('BTreeSet<u8>', types)).toEqual({
      type: 'BTreeSet',
      name: 'BTreeSet<u8>',
      value: {
        type: 'Primitive',
        name: 'u8',
        value: 'u8',
      },
    });
  });
  test('FungibleTokenAction', () => {
    expect(createPayloadTypeStructure('FungibleTokenAction', types)).toEqual({
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
    });
  });
});
