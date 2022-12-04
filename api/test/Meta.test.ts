import { getProgramMetadata, HumanProgramMetadata, Metadata } from '../src';

let programMeta: HumanProgramMetadata;
let meta: Metadata;

beforeAll(() => {
  const hex =
    '0x01000000000103000000010700000001180000000104000000011a0000000000011b000000bd0e8000042042547265655365740404540104000400080000000400000503000800000204000c042042547265654d617008044b0110045601040004001400000010000005020014000002180018000004081004001c0830746573745f6d6574615f696f18416374696f6e0001140c4f6e6504002001384f7074696f6e3c537472696e673e0000000c54776f04002401185665633c583e0001001454687265650401186669656c6431340164526573756c743c2875382c20537472696e67292c206933323e00020010466f75720400400150536f6d655374727563743c753132382c2075383e00030010466976650400540154536f6d655374727563743c537472696e672c20583e000400002004184f7074696f6e04045401100108104e6f6e6500000010536f6d650400100000010000240000022800280830746573745f6d6574615f696f0458000004002c01242875382c207531362900002c00000408043000300000050400340418526573756c7408045401380445013c0108084f6b040038000000000c45727204003c000001000038000004080410003c0000050b00400830746573745f6d6574615f696f28536f6d655374727563740808503101440850320104000c011861727261793848011c5b50313b20385d00011c617272617933324c01205b50323b2033325d0001146163746f7250011c4163746f7249640000440000050700480000030800000044004c0000032000000004005010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004004c01205b75383b2033325d0000540830746573745f6d6574615f696f28536f6d655374727563740808503101100850320128000c011861727261793858011c5b50313b20385d00011c617272617933325c01205b50323b2033325d0001146163746f7250011c4163746f7249640000580000030800000010005c000003200000002800600830746573745f6d6574615f696f2c456d7074795374727563740000040114656d707479640108282900006400000400006800000230006c0000027000700830746573745f6d6574615f696f1857616c6c6574000008010869647401084964000118706572736f6e7c0118506572736f6e0000740830746573745f6d6574615f696f084964000008011c646563696d616c78010c75363400010c68657808011c5665633c75383e00007800000506007c0830746573745f6d6574615f696f18506572736f6e000008011c7375726e616d65100118537472696e670001106e616d65100118537472696e670000';
  programMeta = getProgramMetadata(hex);
  meta = new Metadata(programMeta.reg);
});

describe('Create type test', () => {
  test('Program Metadata', () => {
    expect(programMeta).toEqual({
      init: { input: 0, output: 3 },
      handle: { input: 7, output: 24 },
      reply: { input: 4, output: 26 },
      others: { input: null, output: null },
      state: 27,
      reg: '0x8000042042547265655365740404540104000400080000000400000503000800000204000c042042547265654d617008044b0110045601040004001400000010000005020014000002180018000004081004001c0830746573745f6d6574615f696f18416374696f6e0001140c4f6e6504002001384f7074696f6e3c537472696e673e0000000c54776f04002401185665633c583e0001001454687265650401186669656c6431340164526573756c743c2875382c20537472696e67292c206933323e00020010466f75720400400150536f6d655374727563743c753132382c2075383e00030010466976650400540154536f6d655374727563743c537472696e672c20583e000400002004184f7074696f6e04045401100108104e6f6e6500000010536f6d650400100000010000240000022800280830746573745f6d6574615f696f0458000004002c01242875382c207531362900002c00000408043000300000050400340418526573756c7408045401380445013c0108084f6b040038000000000c45727204003c000001000038000004080410003c0000050b00400830746573745f6d6574615f696f28536f6d655374727563740808503101440850320104000c011861727261793848011c5b50313b20385d00011c617272617933324c01205b50323b2033325d0001146163746f7250011c4163746f7249640000440000050700480000030800000044004c0000032000000004005010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004004c01205b75383b2033325d0000540830746573745f6d6574615f696f28536f6d655374727563740808503101100850320128000c011861727261793858011c5b50313b20385d00011c617272617933325c01205b50323b2033325d0001146163746f7250011c4163746f7249640000580000030800000010005c000003200000002800600830746573745f6d6574615f696f2c456d7074795374727563740000040114656d707479640108282900006400000400006800000230006c0000027000700830746573745f6d6574615f696f1857616c6c6574000008010869647401084964000118706572736f6e7c0118506572736f6e0000740830746573745f6d6574615f696f084964000008011c646563696d616c78010c75363400010c68657808011c5665633c75383e00007800000506007c0830746573745f6d6574615f696f18506572736f6e000008011c7375726e616d65100118537472696e670001106e616d65100118537472696e670000',
    });
  });

  test('Get type structure 0', () => {
    expect(meta.getTypeDef(0)).toEqual(['U8']);
    expect(meta.getTypeDef(0, true)).toEqual({
      name: 'BTreeSet<U8>',
      kind: 'sequence',
      type: { name: 'U8', kind: 'primitive', type: 'U8' },
    });
  });

  test('Get type structure 1', () => {
    expect(meta.getTypeDef(1)).toEqual('U8');
    expect(meta.getTypeDef(1, true)).toEqual({
      name: 'U8',
      kind: 'primitive',
      type: 'U8',
    });
  });

  test('Get type structure 2', () => {
    expect(meta.getTypeDef(2)).toEqual(['U8']);
    expect(meta.getTypeDef(2, true)).toEqual({
      name: 'Vec<U8>',
      kind: 'sequence',
      type: { name: 'U8', kind: 'primitive', type: 'U8' },
    });
  });

  test('Get type structure 3', () => {
    expect(meta.getTypeDef(3)).toEqual([['Str', 'U8']]);
    expect(meta.getTypeDef(3, true)).toEqual({
      name: 'BTreeMap<Str, U8>',
      kind: 'sequence',
      type: {
        name: '(Str, U8)',
        kind: 'tuple',
        type: [
          { name: 'Str', kind: 'primitive', type: 'Str' },
          { name: 'U8', kind: 'primitive', type: 'U8' },
        ],
      },
    });
  });

  test('Get type structure 4', () => {
    expect(meta.getTypeDef(4)).toEqual('Str');
    expect(meta.getTypeDef(4, true)).toEqual({
      name: 'Str',
      kind: 'primitive',
      type: 'Str',
    });
  });

  test('Get type structure 5', () => {
    expect(meta.getTypeDef(5)).toEqual([['Str', 'U8']]);
    expect(meta.getTypeDef(5, true)).toEqual({
      name: 'Vec<(Str, U8)>',
      kind: 'sequence',
      type: {
        name: '(Str, U8)',
        kind: 'tuple',
        type: [
          { name: 'Str', kind: 'primitive', type: 'Str' },
          { name: 'U8', kind: 'primitive', type: 'U8' },
        ],
      },
    });
  });

  test('Get type structure 6', () => {
    expect(meta.getTypeDef(6)).toEqual(['Str', 'U8']);
    expect(meta.getTypeDef(6, true)).toEqual({
      name: '(Str, U8)',
      kind: 'tuple',
      type: [
        { name: 'Str', kind: 'primitive', type: 'Str' },
        { name: 'U8', kind: 'primitive', type: 'U8' },
      ],
    });
  });

  test('Get type structure 7', () => {
    expect(meta.getTypeDef(7)).toEqual({
      _variants: {
        One: {
          _variants: {
            None: null,
            Some: 'Str',
          },
        },
        Two: [['U8', 'U16']],
        Three: {
          _variants: {
            Ok: ['U8', 'Str'],
            Err: 'I32',
          },
        },
        Four: {
          array8: ['U128', 8],
          array32: ['U8', 32],
          actor: ['U8', 32],
        },
        Five: {
          array8: ['Str', 8],
          array32: [['U8', 'U16'], 32],
          actor: ['U8', 32],
        },
      },
    });
    expect(meta.getTypeDef(7, true)).toEqual({
      name: 'TestMetaIoAction',
      kind: 'variant',
      type: {
        One: {
          kind: 'variant',
          name: 'Option<Str>',
          type: {
            None: null,
            Some: {
              name: 'Str',
              kind: 'primitive',
              type: 'Str',
            },
          },
        },
        Two: {
          name: 'Vec<X>',
          kind: 'sequence',
          type: {
            name: 'X',
            kind: 'tuple',
            type: [
              { name: 'U8', kind: 'primitive', type: 'U8' },
              { name: 'U16', kind: 'primitive', type: 'U16' },
            ],
          },
        },
        Three: {
          name: 'Result<(U8, Str), I32>',
          kind: 'variant',
          type: {
            Ok: {
              name: '(U8, Str)',
              kind: 'tuple',
              type: [
                { name: 'U8', kind: 'primitive', type: 'U8' },
                { name: 'Str', kind: 'primitive', type: 'Str' },
              ],
            },
            Err: {
              name: 'I32',
              kind: 'primitive',
              type: 'I32',
            },
          },
        },
        Four: {
          name: 'SomeStruct<U128, U8>',
          kind: 'composite',
          type: {
            array8: {
              name: '[U128;8]',
              kind: 'array',
              type: { type: 'U128', name: 'U128', kind: 'primitive' },
              len: 8,
            },
            array32: { name: '[U8;32]', kind: 'array', type: { type: 'U8', name: 'U8', kind: 'primitive' }, len: 32 },
            actor: { name: 'ActorId', kind: 'array', type: { type: 'U8', name: 'U8', kind: 'primitive' }, len: 32 },
          },
        },
        Five: {
          name: 'SomeStruct<Str, X>',
          kind: 'composite',
          type: {
            array8: { name: '[Str;8]', kind: 'array', type: { type: 'Str', name: 'Str', kind: 'primitive' }, len: 8 },
            array32: {
              name: '[X;32]',
              kind: 'array',
              type: {
                name: 'X',
                kind: 'tuple',
                type: [
                  { name: 'U8', kind: 'primitive', type: 'U8' },
                  { name: 'U16', kind: 'primitive', type: 'U16' },
                ],
              },
              len: 32,
            },
            actor: { name: 'ActorId', kind: 'array', type: { type: 'U8', name: 'U8', kind: 'primitive' }, len: 32 },
          },
        },
      },
    });
  });

  test('Get type structure 8', () => {
    expect(meta.getTypeDef(8)).toEqual({
      _variants: {
        None: null,
        Some: 'Str',
      },
    });
    expect(meta.getTypeDef(8, true)).toEqual({
      name: 'Option<Str>',
      kind: 'variant',
      type: {
        None: null,
        Some: { name: 'Str', kind: 'primitive', type: 'Str' },
      },
    });
  });

  test('Get type structure 9', () => {
    expect(meta.getTypeDef(9)).toEqual([['U8', 'U16']]);
    expect(meta.getTypeDef(9, true)).toEqual({
      name: 'Vec<X>',
      kind: 'sequence',
      type: {
        name: 'X',
        kind: 'tuple',
        type: [
          { name: 'U8', kind: 'primitive', type: 'U8' },
          { name: 'U16', kind: 'primitive', type: 'U16' },
        ],
      },
    });
  });

  test('Get type structure 10', () => {
    expect(meta.getTypeDef(10)).toEqual(['U8', 'U16']);
    expect(meta.getTypeDef(10, true)).toEqual({
      name: 'X',
      kind: 'tuple',
      type: [
        { name: 'U8', kind: 'primitive', type: 'U8' },
        { name: 'U16', kind: 'primitive', type: 'U16' },
      ],
    });
  });

  test('Get type structure 11', () => {
    expect(meta.getTypeDef(11)).toEqual(['U8', 'U16']);
    expect(meta.getTypeDef(11, true)).toEqual({
      name: '(U8, U16)',
      kind: 'tuple',
      type: [
        { name: 'U8', kind: 'primitive', type: 'U8' },
        { name: 'U16', kind: 'primitive', type: 'U16' },
      ],
    });
  });

  test('Get type structure 12', () => {
    expect(meta.getTypeDef(12)).toEqual('U16');
    expect(meta.getTypeDef(12, true)).toEqual({
      name: 'U16',
      kind: 'primitive',
      type: 'U16',
    });
  });

  test('Get type structure 13', () => {
    expect(meta.getTypeDef(13)).toEqual({
      _variants: {
        Ok: ['U8', 'Str'],
        Err: 'I32',
      },
    });
    expect(meta.getTypeDef(13, true)).toEqual({
      name: 'Result<(U8, Str), I32>',
      kind: 'variant',
      type: {
        Ok: {
          name: '(U8, Str)',
          kind: 'tuple',
          type: [
            { name: 'U8', kind: 'primitive', type: 'U8' },
            { name: 'Str', kind: 'primitive', type: 'Str' },
          ],
        },
        Err: {
          name: 'I32',
          kind: 'primitive',
          type: 'I32',
        },
      },
    });
  });

  test('Get type structure 14', () => {
    expect(meta.getTypeDef(14)).toEqual(['U8', 'Str']);
    expect(meta.getTypeDef(14, true)).toEqual({
      name: '(U8, Str)',
      kind: 'tuple',
      type: [
        { name: 'U8', kind: 'primitive', type: 'U8' },
        { name: 'Str', kind: 'primitive', type: 'Str' },
      ],
    });
  });

  test('Get type structure 15', () => {
    expect(meta.getTypeDef(15)).toEqual('I32');
    expect(meta.getTypeDef(15, true)).toEqual({
      name: 'I32',
      kind: 'primitive',
      type: 'I32',
    });
  });

  test('Get type structure 16', () => {
    expect(meta.getTypeDef(16)).toEqual({
      array8: ['U128', 8],
      array32: ['U8', 32],
      actor: ['U8', 32],
    });
    expect(meta.getTypeDef(16, true)).toEqual({
      name: 'SomeStruct<U128, U8>',
      kind: 'composite',
      type: {
        array8: { name: '[U128;8]', kind: 'array', type: { type: 'U128', name: 'U128', kind: 'primitive' }, len: 8 },
        array32: { name: '[U8;32]', kind: 'array', type: { type: 'U8', name: 'U8', kind: 'primitive' }, len: 32 },
        actor: { name: 'ActorId', kind: 'array', type: { type: 'U8', name: 'U8', kind: 'primitive' }, len: 32 },
      },
    });
  });

  test('Get type structure 17', () => {
    expect(meta.getTypeDef(17)).toEqual('U128');
    expect(meta.getTypeDef(17, true)).toEqual({ name: 'U128', kind: 'primitive', type: 'U128' });
  });

  test('Get type structure 18', () => {
    expect(meta.getTypeDef(18)).toEqual(['U128', 8]);
    expect(meta.getTypeDef(18, true)).toEqual({
      name: '[U128;8]',
      kind: 'array',
      len: 8,
      type: { name: 'U128', kind: 'primitive', type: 'U128' },
    });
  });

  test('Get type structure 19', () => {
    expect(meta.getTypeDef(19)).toEqual(['U8', 32]);
    expect(meta.getTypeDef(19, true)).toEqual({
      name: '[U8;32]',
      kind: 'array',
      len: 32,
      type: { name: 'U8', kind: 'primitive', type: 'U8' },
    });
  });

  test('Get type structure 20', () => {
    expect(meta.getTypeDef(20)).toEqual(['U8', 32]); //??? ActorId
    expect(meta.getTypeDef(20, true)).toEqual({
      name: 'ActorId',
      kind: 'array',
      len: 32,
      type: { name: 'U8', kind: 'primitive', type: 'U8' },
    });
  }); // TODO (ActorId as separate type)

  test('Get type structure 21', () => {
    expect(meta.getTypeDef(21)).toEqual({
      array8: ['Str', 8],
      array32: [['U8', 'U16'], 32],
      actor: ['U8', 32],
    });
    expect(meta.getTypeDef(21, true)).toEqual({
      name: 'SomeStruct<Str, X>',
      kind: 'composite',
      type: {
        array8: { name: '[Str;8]', kind: 'array', type: { type: 'Str', name: 'Str', kind: 'primitive' }, len: 8 },
        array32: {
          name: '[X;32]',
          kind: 'array',
          type: {
            name: 'X',
            kind: 'tuple',
            type: [
              { name: 'U8', kind: 'primitive', type: 'U8' },
              { name: 'U16', kind: 'primitive', type: 'U16' },
            ],
          },
          len: 32,
        },
        actor: { name: 'ActorId', kind: 'array', type: { type: 'U8', name: 'U8', kind: 'primitive' }, len: 32 },
      },
    });
  });

  test('Get type structure 22', () => {
    expect(meta.getTypeDef(22)).toEqual(['Str', 8]);
    expect(meta.getTypeDef(22, true)).toEqual({
      name: '[Str;8]',
      kind: 'array',
      type: { type: 'Str', name: 'Str', kind: 'primitive' },
      len: 8,
    });
  });

  test('Get type structure 23', () => {
    expect(meta.getTypeDef(23)).toEqual([['U8', 'U16'], 32]);
    expect(meta.getTypeDef(23, true)).toEqual({
      name: '[X;32]',
      kind: 'array',
      type: {
        name: 'X',
        kind: 'tuple',
        type: [
          { name: 'U8', kind: 'primitive', type: 'U8' },
          { name: 'U16', kind: 'primitive', type: 'U16' },
        ],
      },
      len: 32,
    });
  });

  test('Get type structure 24', () => {
    expect(meta.getTypeDef(24)).toEqual({ empty: null });
    expect(meta.getTypeDef(24, true)).toEqual({
      name: 'EmptyStruct',
      kind: 'composite',
      type: { empty: { name: '()', kind: 'empty', type: null } },
    });
  });

  test('Get type structure 25', () => {
    expect(meta.getTypeDef(25)).toEqual(null);
    expect(meta.getTypeDef(25, true)).toEqual({ name: '()', kind: 'empty', type: null });
  });

  test('Get type structure 26', () => {
    expect(meta.getTypeDef(26)).toEqual(['U16']);
    expect(meta.getTypeDef(26, true)).toEqual({
      name: 'Vec<U16>',
      kind: 'sequence',
      type: { name: 'U16', kind: 'primitive', type: 'U16' },
    });
  });

  test('Get type structure 27', () => {
    expect(meta.getTypeDef(27)).toEqual([
      {
        id: {
          decimal: 'U64',
          hex: ['U8'],
        },
        person: {
          surname: 'Str',
          name: 'Str',
        },
      },
    ]);
    expect(meta.getTypeDef(27, true)).toEqual({
      name: 'Vec<Wallet>',
      kind: 'sequence',
      type: {
        name: 'Wallet',
        kind: 'composite',
        type: {
          id: {
            name: 'Id',
            kind: 'composite',
            type: {
              decimal: { name: 'U64', kind: 'primitive', type: 'U64' },
              hex: { name: 'Vec<U8>', kind: 'sequence', type: { name: 'U8', kind: 'primitive', type: 'U8' } },
            },
          },
          person: {
            name: 'Person',
            kind: 'composite',
            type: {
              surname: { name: 'Str', kind: 'primitive', type: 'Str' },
              name: { name: 'Str', kind: 'primitive', type: 'Str' },
            },
          },
        },
      },
    });
  });

  test('Get type structure 28', () => {
    expect(meta.getTypeDef(28)).toEqual({
      id: {
        decimal: 'U64',
        hex: ['U8'],
      },
      person: {
        surname: 'Str',
        name: 'Str',
      },
    });
    expect(meta.getTypeDef(28, true)).toEqual({
      name: 'Wallet',
      kind: 'composite',
      type: {
        id: {
          name: 'Id',
          kind: 'composite',
          type: {
            decimal: { name: 'U64', kind: 'primitive', type: 'U64' },
            hex: { name: 'Vec<U8>', kind: 'sequence', type: { name: 'U8', kind: 'primitive', type: 'U8' } },
          },
        },
        person: {
          name: 'Person',
          kind: 'composite',
          type: {
            surname: { name: 'Str', kind: 'primitive', type: 'Str' },
            name: { name: 'Str', kind: 'primitive', type: 'Str' },
          },
        },
      },
    });
  });

  test('Get type structure 29', () => {
    expect(meta.getTypeDef(29)).toEqual({
      decimal: 'U64',
      hex: ['U8'],
    });
    expect(meta.getTypeDef(29, true)).toEqual({
      name: 'Id',
      kind: 'composite',
      type: {
        decimal: { name: 'U64', kind: 'primitive', type: 'U64' },
        hex: { name: 'Vec<U8>', kind: 'sequence', type: { name: 'U8', kind: 'primitive', type: 'U8' } },
      },
    });
  });

  test('Get type structure 30', () => {
    expect(meta.getTypeDef(30)).toEqual('U64');
    expect(meta.getTypeDef(30, true)).toEqual({ name: 'U64', kind: 'primitive', type: 'U64' });
  });

  test('Get type structure 31', () => {
    expect(meta.getTypeDef(31)).toEqual({
      surname: 'Str',
      name: 'Str',
    });
    expect(meta.getTypeDef(31, true)).toEqual({
      name: 'Person',
      kind: 'composite',
      type: {
        surname: { name: 'Str', kind: 'primitive', type: 'Str' },
        name: { name: 'Str', kind: 'primitive', type: 'Str' },
      },
    });
  });
});
