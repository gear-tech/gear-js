import { createPayloadTypeStructure, CreateType, decodeHexTypes } from '../src';

describe('Create type structure test', () => {
  let types: any;
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
      GenericInStruct:
        '{"nftContractId":"ActorId","ftContractId":"Option<ActorId>","tokenId":"U256","price":"Option<u128>"}',
      TupleInStruct: '{"nftContractId":"ActorId","someTuple":"(u128, String)"}',
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
    expect(createPayloadTypeStructure('TupleInStruct', types, false)).toEqual({
      type: 'Struct',
      name: 'TupleInStruct',
      value: {
        nftContractId: {
          type: 'Primitive',
          name: 'ActorId',
          value: 'ActorId',
        },
        someTuple: {
          type: 'Tuple',
          name: '(u128, String)',
          value: [
            { type: 'Primitive', name: 'u128', value: 'u128' },
            { type: 'Primitive', name: 'String', value: 'String' },
          ],
        },
      },
    });
    expect(createPayloadTypeStructure('GenericInStruct', types)).toEqual({
      type: 'Struct',
      name: 'GenericInStruct',
      value: {
        nftContractId: {
          type: 'Primitive',
          name: 'ActorId',
          value: 'ActorId',
        },
        ftContractId: {
          type: 'Option',
          name: 'Option<ActorId>',
          value: {
            type: 'Primitive',
            name: 'ActorId',
            value: 'ActorId',
          },
        },
        tokenId: {
          type: 'Primitive',
          name: 'U256',
          value: 'U256',
        },
        price: {
          type: 'Option',
          name: 'Option<u128>',
          value: {
            type: 'Primitive',
            name: 'u128',
            value: 'u128',
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
  test('Raw Result', () => {
    expect(createPayloadTypeStructure('Result<String, i32>', {}, true)).toEqual({
      _Result: {
        ok: 'String',
        err: 'i32',
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
  test('Raw Tuple', () => {
    expect(createPayloadTypeStructure('(String, u8)', types, true)).toEqual(['String', 'u8']);
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
  test('Raw Array', () => {
    expect(createPayloadTypeStructure('[u8;4]', types, true)).toEqual(['u8', 4]);
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
  test('Raw Option', () => {
    expect(createPayloadTypeStructure('Option<AStruct>', types, true)).toEqual({
      _Option: {
        id: 'Bytes',
        online: 'bool',
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
  test('Raw BTreeMap', () => {
    expect(createPayloadTypeStructure('BTreeMap<String, u8>', types, true)).toEqual({
      _BTreeMap: ['String', 'u8'],
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
  test('Raw BTreeSet', () => {
    expect(createPayloadTypeStructure('BTreeSet<u8>', types, true)).toEqual({
      _BTreeSet: 'u8',
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
  test('Raw FungibleTokenAction', () => {
    expect(createPayloadTypeStructure('FungibleTokenAction', types, true)).toEqual({
      _enum: {
        Mint: 'u128',
        Burn: 'u128',
        Transfer: { from: 'ActorId', to: 'ActorId', amount: 'u128' },
        Approve: { to: 'ActorId', amount: 'u128' },
        TotalSupply: 'Null',
        BalanceOf: 'ActorId',
      },
    });
  });
});

describe('Replace namespaces test', () => {
  const types =
    '0x680008186e66745f696f1c496e69744e465400001401106e616d65040118537472696e6700011873796d626f6c040118537472696e67000120626173655f757269040118537472696e67000118737570706c7908011055323536000124726f79616c746965731401444f7074696f6e3c526f79616c746965733e000004000005020008083c7072696d69746976655f74797065731055323536000004000c01205b7536343b20345d00000c0000030400000010001000000506001404184f7074696f6e04045401180108104e6f6e6500000010536f6d650400180000010000180824726f79616c7469657324526f79616c7469657300000801206163636f756e74731c015842547265654d61703c4163746f7249642c207531363e00011c70657263656e742c010c75313600001c042042547265654d617008044b01200456012c000400300000002010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004002401205b75383b2033325d0000240000032000000028002800000503002c00000504003000000234003400000408202c003808186e66745f696f244e4654416374696f6e000120104d696e740801146d65646961040118537472696e670001247265666572656e6365040118537472696e67000000104275726e040008011055323536000100205472616e73666572080108746f20011c4163746f724964000120746f6b656e5f6964080110553235360002001c417070726f7665080108746f20011c4163746f724964000120746f6b656e5f6964080110553235360003001c4f776e65724f660400080110553235360004002442616c616e63654f66040020011c4163746f72496400050038546f6b656e73466f724f776e6572040020011c4163746f724964000600244e46545061796f75740801146f776e657220011c4163746f724964000118616d6f756e743c011075313238000700003c00000507004008186e66745f696f204e46544576656e7400011c205472616e736665720c011066726f6d20011c4163746f724964000108746f20011c4163746f724964000120746f6b656e5f69640801105532353600000020417070726f76616c0c01146f776e657220011c4163746f72496400011c7370656e64657220011c4163746f724964000120746f6b656e5f69640801105532353600010038417070726f76616c466f72416c6c0c01146f776e657220011c4163746f7249640001206f70657261746f7220011c4163746f724964000120617070726f766564440110626f6f6c0002001c4f776e65724f66040020011c4163746f7249640003002442616c616e63654f6604000801105532353600040038546f6b656e73466f724f776e657204004801245665633c553235363e000500244e46545061796f757404004c015c42547265654d61703c4163746f7249642c20753132383e000600004400000500004800000208004c042042547265654d617008044b01200456013c000400500000005000000254005400000408203c00580c0c6e66741473746174651453746174650001103442616c616e63654f665573657204005c01104832353600000028546f6b656e4f776e6572040008011055323536000100304973546f6b656e4f776e65720400600130546f6b656e416e64557365720002002c476574417070726f766564040008011055323536000300005c083c7072696d69746976655f74797065731048323536000004002401205b75383b2033325d0000600c0c6e667414737461746530546f6b656e416e64557365720000080120746f6b656e5f696408011055323536000110757365725c0110483235360000640c0c6e66741473746174652853746174655265706c790001103442616c616e63654f665573657204000801105532353600000028546f6b656e4f776e657204005c011048323536000100304973546f6b656e4f776e65720400440110626f6f6c0002002c476574417070726f76656404005c01104832353600030000';
  test('NFT registry', () => {
    expect(decodeHexTypes(types)).toHaveProperty('Royalties');
    expect(decodeHexTypes(types)).toHaveProperty('State');
  });
  test('Create type Royalties', () => {
    const encoded = CreateType.create(
      'Royalties',
      {
        accounts: {
          '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY': 20,
          '5GrwvaEF5zab26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY': 30,
        },
        percent: 16,
      },
      { types },
    );
    expect(encoded.toHex()).toBe(
      '0x083547727776614546357a58623236467a3972635170445753353743744552487014003547727776614546357a61623236467a397263517044575335374374455248701e001000',
    );
    expect(encoded.toHuman()).toEqual({
      accounts: {
        '0x3547727776614546357a58623236467a39726351704457533537437445524870': '20',
        '0x3547727776614546357a61623236467a39726351704457533537437445524870': '30',
      },
      percent: '16',
    });
  });
});

describe(`Create a type that differs from existing one in the registry`, () => {
  const types =
    '0x2800081466745f696f28496e6974436f6e66696700000801106e616d65040118537472696e6700011873796d626f6c040118537472696e67000004000005020008081466745f696f204654416374696f6e000118104d696e7404000c011075313238000000104275726e04000c011075313238000100205472616e736665720c011066726f6d10011c4163746f724964000108746f10011c4163746f724964000118616d6f756e740c0110753132380002001c417070726f7665080108746f10011c4163746f724964000118616d6f756e740c0110753132380003002c546f74616c537570706c790004002442616c616e63654f66040010011c4163746f724964000500000c00000507001010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004001401205b75383b2033325d0000140000032000000018001800000503001c081466745f696f1c46544576656e74000110205472616e736665720c011066726f6d10011c4163746f724964000108746f10011c4163746f724964000118616d6f756e740c0110753132380000001c417070726f76650c011066726f6d10011c4163746f724964000108746f10011c4163746f724964000118616d6f756e740c0110753132380001002c546f74616c537570706c7904000c0110753132380002001c42616c616e636504000c0110753132380003000020081466745f696f145374617465000114104e616d650000001853796d626f6c00010020446563696d616c730002002c546f74616c537570706c790003002442616c616e63654f66040010011c4163746f7249640004000024081466745f696f2853746174655265706c79000114104e616d650400040118537472696e670000001853796d626f6c0400040118537472696e6700010020446563696d616c73040018010875380002002c546f74616c537570706c7904000c0110753132380003001c42616c616e636504000c01107531323800040000';

  test('FTAction', () => {
    expect(createPayloadTypeStructure('FTAction', decodeHexTypes(types), true)).toEqual({
      _enum: {
        Approve: { amount: 'u128', to: 'ActorId' },
        BalanceOf: 'ActorId',
        Burn: 'u128',
        Mint: 'u128',
        TotalSupply: 'Null',
        Transfer: { amount: 'u128', from: 'ActorId', to: 'ActorId' },
      },
    });
  });
  test('FTEvent', () => {
    expect(createPayloadTypeStructure('FTEvent', decodeHexTypes(types), true)).toEqual({
      _enum: {
        Approve: { amount: 'u128', from: 'ActorId', to: 'ActorId' },
        Balance: 'u128',
        TotalSupply: 'u128',
        Transfer: { amount: 'u128', from: 'ActorId', to: 'ActorId' },
      },
    });
  });
});
