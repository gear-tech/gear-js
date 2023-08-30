import { TEST_META_META } from './config';
import fs from 'fs';

import { ProgramMetadata } from '../src';

let meta: ProgramMetadata;

beforeAll(() => {
  const hex = fs.readFileSync(TEST_META_META, 'utf-8');
  meta = ProgramMetadata.from(`0x${hex}`);
});

describe('Get type definitions', () => {
  test('Program Metadata', () => {
    expect(meta.types).toEqual({
      init: { input: 0, output: 3 },
      handle: { input: 7, output: 4 },
      reply: 4,
      others: { input: null, output: null },
      signal: 26,
      state: { input: 27, output: 29 },
    });
  });

  test('Get type structure 0', () => {
    expect(meta.getTypeDef(0)).toEqual(['U8']);
    expect(meta.getTypeName(0)).toEqual('BTreeSet<U8>');
    expect(meta.getTypeIndexByName('BTreeSet<U8>')).toEqual(0);
    expect(meta.getTypeDef(0, true)).toEqual({
      name: 'BTreeSet<U8>',
      kind: 'sequence',
      type: { name: 'U8', kind: 'primitive', type: 'U8' },
    });
  });

  test('Get type structure 1', () => {
    expect(meta.getTypeDef(1)).toEqual('U8');
    expect(meta.getTypeName(1)).toEqual('U8');
    expect(meta.getTypeIndexByName('U8')).toEqual(1);
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
          field1: {
            _variants: {
              Ok: ['U8', 'Str'],
              Err: 'I32',
            },
          },
        },
        Four: {
          array8: ['U128', 8],
          array32: ['U8', 32],
          actor: 'ActorId',
        },
        Five: {
          array8: ['Str', 8],
          array32: [['U8', 'U16'], 32],
          actor: 'ActorId',
        },
        Six: ['ActorId', { empty: null }],
      },
    });
    expect(meta.getTypeDef(7, true)).toEqual({
      name: 'TestMetaIoAction',
      kind: 'variant',
      type: {
        One: {
          kind: 'option',
          name: 'Option<Str>',
          type: {
            None: { name: 'None', kind: 'none', type: null },
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
          kind: 'composite',
          name: null,
          type: {
            field1: {
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
            actor: { name: 'ActorId', kind: 'actorid', type: 'actorid' },
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
            actor: { name: 'ActorId', kind: 'actorid', type: 'actorid' },
          },
        },
        Six: {
          kind: 'tuple',
          name: null,
          type: [
            {
              kind: 'actorid',
              name: 'ActorId',
              type: 'actorid',
            },
            {
              kind: 'composite',
              name: 'EmptyStruct',
              type: {
                empty: {
                  kind: 'empty',
                  name: '()',
                  type: null,
                },
              },
            },
          ],
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
      kind: 'option',
      type: {
        None: { name: 'None', kind: 'none', type: null },
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
    expect(meta.createType(9, [[8, 16]]).toJSON()).toEqual([[8, 16]]);
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
      actor: 'ActorId',
    });
    expect(meta.getTypeDef(16, true)).toEqual({
      name: 'SomeStruct<U128, U8>',
      kind: 'composite',
      type: {
        array8: { name: '[U128;8]', kind: 'array', type: { type: 'U128', name: 'U128', kind: 'primitive' }, len: 8 },
        array32: { name: '[U8;32]', kind: 'array', type: { type: 'U8', name: 'U8', kind: 'primitive' }, len: 32 },
        actor: { name: 'ActorId', kind: 'actorid', type: 'actorid' },
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
    expect(meta.getTypeDef(20)).toEqual('ActorId');
    expect(meta.getTypeDef(20, true)).toEqual({
      name: 'ActorId',
      kind: 'actorid',
      type: 'actorid',
    });
  });

  test('Get type structure 21', () => {
    expect(meta.getTypeDef(21)).toEqual({
      array8: ['Str', 8],
      array32: [['U8', 'U16'], 32],
      actor: 'ActorId',
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
        actor: { name: 'ActorId', kind: 'actorid', type: 'actorid' },
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
    expect(meta.getTypeDef(26)).toEqual('H256');
    expect(meta.getTypeDef(26, true)).toEqual({ kind: 'primitive', name: 'H256', type: 'H256' });
  });
});

const payload =
  '0x0400d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d05000000000000001400000000000000586eb14e880100000003000400050003000000000504010003050304000400000305000005050304000400030505050505040502020404040101020304050403020405020301010104000004000304040400050405040504000000050005040403040200040405000205030500000505000304020404030202050304010100000004020005000500030504050305030304030300030403040404020403000304040505050203050301000403050000050404020202020100040005050304020304020305040204050004030405040202040304030300030300040303050004d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d2c416c6963652046726f6e74010000000000000000000000000000000000000000000000015aee829cef5af3b1e94e099fceb00886b632ca76b98cbb359477a5492d83933205000000000000000100000000000000e803d007b80b05000000000000001400000000000000';

//TODO: new VaraMan metadata
const metaHex =
  '0x0001000100000000000107000000010b0000000000000000010c000000e5196400082c766172615f6d616e5f696f2c566172614d616e496e69740000040118636f6e666967040118436f6e666967000004082c766172615f6d616e5f696f18436f6e66696700002001206f70657261746f7208011c4163746f724964000150746f6b656e735f7065725f676f6c645f636f696e14010c753634000158746f6b656e735f7065725f73696c7665725f636f696e14010c753634000154656173795f7265776172645f7363616c655f62707318010c75313600015c6d656469756d5f7265776172645f7363616c655f62707318010c753136000154686172645f7265776172645f7363616c655f62707318010c753136000128676f6c645f636f696e7314010c75363400013073696c7665725f636f696e7314010c75363400000810106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000c01205b75383b2033325d00000c0000032000000010001000000503001400000506001800000504001c082c766172615f6d616e5f696f34566172614d616e416374696f6e00011424537461727447616d650801146c6576656c2001144c6576656c0001107365656414012047616d6553656564000000385265676973746572506c617965720401106e616d65240118537472696e670001002c436c61696d5265776172640c011c67616d655f696414010c75363400013073696c7665725f636f696e7314010c753634000128676f6c645f636f696e7314010c753634000200304368616e67655374617475730400280118537461747573000300304368616e6765436f6e6669670400040118436f6e6669670004000020082c766172615f6d616e5f696f144c6576656c00010c1045617379000000184d656469756d00010010486172640002000024000005020028082c766172615f6d616e5f696f18537461747573000108185061757365640000001c53746172746564000100002c082c766172615f6d616e5f696f30566172614d616e4576656e740001182c47616d6553746172746564040014010c75363400000034526577617264436c61696d6564100138706c617965725f6164647265737308011c4163746f72496400011c67616d655f696414010c75363400013073696c7665725f636f696e7314010c753634000128676f6c645f636f696e7314010c75363400010040506c6179657252656769737465726564040008011c4163746f724964000200345374617475734368616e676564040028011853746174757300030034436f6e6669674368616e6765640400040118436f6e666967000400144572726f720400240118537472696e670005000030082c766172615f6d616e5f696f1c566172614d616e000010011467616d65733401445665633c47616d65496e7374616e63653e00011c706c61796572735801585665633c284163746f7249642c20506c61796572293e000118737461747573280118537461747573000118636f6e666967040118436f6e666967000034000002380038082c766172615f6d616e5f696f3047616d65496e7374616e636500001c01146c6576656c2001144c6576656c000138706c617965725f6164647265737308011c4163746f724964000128676f6c645f636f696e7314010c75363400013073696c7665725f636f696e7314010c75363400013473746172745f74696d655f6d733c010c69363400012869735f636c61696d6564400110626f6f6c00010c6d61704401845b5b456e746974793b204d41505f57494454485d3b204d41505f4845494748545d00003c0000050c00400000050000440000030c000000480048000003110000004c004c082c766172615f6d616e5f696f18456e7469747900011814456d70747900000020476f6c64436f696e04005001384f7074696f6e3c4566666563743e0001002853696c766572436f696e000200245a6f6d626965436174000300184261744361740004002042756c6c79436174000500005004184f7074696f6e04045401540108104e6f6e6500000010536f6d65040054000001000054082c766172615f6d616e5f696f1845666665637400010c14537065656400000010536c6f7700010014426c696e6400020000580000025c005c0000040808600060082c766172615f6d616e5f696f18506c6179657200001001106e616d65240118537472696e6700011c7265747269657314010c753634000148636c61696d65645f676f6c645f636f696e7314010c753634000150636c61696d65645f73696c7665725f636f696e7314010c7536340000';

describe.skip('Decode complicated type', () => {
  test('Check that there is no Lookup types in type defenitions', () => {
    meta = ProgramMetadata.from(metaHex);

    let isLookupTypeFound = false;

    for (const type of Object.values(meta.getAllTypes() as Record<string, string>)) {
      if (type.includes('Lookup')) {
        isLookupTypeFound = true;
      }
    }

    expect(isLookupTypeFound).toBeFalsy();
  });

  test('Decode payload', () => {
    const decoded = meta.createType(meta.types.state as number, payload);
    const json = decoded.toJSON() as any;

    expect(json).toHaveProperty('config');
    expect(json).toHaveProperty('games');
    expect(json).toHaveProperty('players');
    expect(json).toHaveProperty('status');

    expect(json.games).toHaveLength(1);
    expect(json.games).toHaveProperty('map');
    expect(json.games[0].map).toHaveLength(12);

    for (const item of json.games[0].map) {
      expect(item).toHaveLength(17);
    }
  });
});

const activitiesMetaHex =
  '00010000000100000000010e000000000000000111000000411350000834616374697669746965735f696f18416374696f6e0001142041646441646d696e040004011c4163746f7249640000002c52656d6f766541646d696e040004011c4163746f7249640001002c41646441637469766974790401206163746976697479100120416374697669747900020038557064617465416374697669747924012c61637469766974795f696428010c7533320001147469746c652c01384f7074696f6e3c537472696e673e00012c6465736372697074696f6e2c01384f7074696f6e3c537472696e673e0001106c696e6b2c01384f7074696f6e3c537472696e673e0001306c6162656c5f6163746976652c01384f7074696f6e3c537472696e673e0001386c6162656c5f696e6163746976652c01384f7074696f6e3c537472696e673e00012873746172745f6461746530012c4f7074696f6e3c7536343e000120646f6e655f6b65792c01384f7074696f6e3c537472696e673e000128646570656e64735f6f6e34014c4f7074696f6e3c5665633c537472696e673e3e0003003852656d6f7665416374697669747904012c61637469766974795f696428010c753332000400000410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000008000003200000000c000c0000050300100834616374697669746965735f696f20416374697669747900002401147469746c65140118537472696e6700012c6465736372697074696f6e140118537472696e670001106c696e6b140118537472696e670001306c6162656c5f616374697665140118537472696e670001386c6162656c5f696e616374697665140118537472696e6700011c726577617264731801304f7074696f6e3c753132383e00012873746172745f6461746520010c753634000120646f6e655f6b6579140118537472696e67000128646570656e64735f6f6e24012c5665633c537472696e673e00001400000502001804184f7074696f6e040454011c0108104e6f6e6500000010536f6d6504001c00000100001c00000507002000000506002400000214002800000505002c04184f7074696f6e04045401140108104e6f6e6500000010536f6d6504001400000100003004184f7074696f6e04045401200108104e6f6e6500000010536f6d6504002000000100003404184f7074696f6e04045401240108104e6f6e6500000010536f6d650400240000010000380418526573756c74080454013c044501400108084f6b04003c000000000c45727204004000000100003c0834616374697669746965735f696f145265706c790001142841646d696e41646465640000003041646d696e52656d6f76656400010034416374697669747941646465640002003c416374697669747952656d6f7665640003003c41637469766974795570646174656400040000400834616374697669746965735f696f144572726f7200010c34436f6e74726163744572726f720400140118537472696e67000000204e6f7441646d696e0001003c57726f6e674163746976697479496400020000440834616374697669746965735f696f2841637469766974696573000008011861646d696e734801305665633c4163746f7249643e000128616374697669746965734c01345665633c41637469766974793e00004800000204004c0000021000';

describe('Create Option type', () => {
  test('test', () => {
    const meta = ProgramMetadata.from(activitiesMetaHex);

    const type = meta.getTypeDef(meta.types.handle.input!, true);

    expect(type.type['UpdateActivity'].type.depends_on.kind).toBe('option');

    const data = meta.createType(meta.types.handle.input!, {
      UpdateActivity: {
        activityId: 1,
        title: null,
        description: null,
        link: null,
        labelActive: null,
        labelInactive: null,
        startDate: null,
        doneKey: null,
        dependsOn: null,
      },
    });

    expect(Array.from(data.toU8a())).toEqual([3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});

describe('Tuple Struct', () => {
  const metaHex =
    '0001000100000000000104000000010700000000000000010a000000a50f48000834626174746c65736869705f696f38426174746c6573686970496e6974000004012c626f745f6164647265737304011c4163746f72496400000410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000008000003200000000c000c0000050300100834626174746c65736869705f696f40426174746c6573686970416374696f6e00010824537461727447616d6504011473686970731401145368697073000000105475726e040110737465700c0108753800010000140834626174746c65736869705f696f1453686970730000100018011c5665633c75383e000018011c5665633c75383e000018011c5665633c75383e000018011c5665633c75383e0000180000020c001c0834626174746c65736869705f696f3c426174746c65736869705265706c7900010c2c47616d6553746172746564000000244d6f7665734d6164650400200110537465700001001c456e6447616d650400240158426174746c65736869705061727469636970616e747300020000200834626174746c65736869705f696f105374657000010c184d69737365640000001c496e6a75726564000100184b696c6c656400020000240834626174746c65736869705f696f58426174746c65736869705061727469636970616e747300010818506c617965720000000c426f7400010000280834626174746c65736869705f696f3c426174746c65736869705374617465000008011467616d65732c01505665633c284163746f7249642c2047616d65293e00012c626f745f6164647265737304011c4163746f72496400002c00000230003000000408043400340834626174746c65736869705f696f1047616d6500001c0130706c617965725f626f61726438012c5665633c456e746974793e000124626f745f626f61726438012c5665633c456e746974793e000130706c617965725f73686970731401145368697073000124626f745f736869707314011453686970730001107475726e4001784f7074696f6e3c426174746c65736869705061727469636970616e74733e00012467616d655f6f766572440110626f6f6c00012c67616d655f726573756c744001784f7074696f6e3c426174746c65736869705061727469636970616e74733e0000380000023c003c0834626174746c65736869705f696f18456e7469747900011c14456d7074790000001c556e6b6e6f776e000100204f63637570696564000200105368697000030010426f6f6d00040020426f6f6d53686970000500204465616453686970000600004004184f7074696f6e04045401240108104e6f6e6500000010536f6d650400240000010000440000050000';
  const meta = ProgramMetadata.from(metaHex);

  test('', () => {
    expect(meta.getTypeDef(meta.types.handle.input!, true)).toEqual({
      kind: 'variant',
      name: 'BattleshipIoBattleshipAction',
      type: {
        StartGame: {
          kind: 'composite',
          name: null,
          type: {
            ships: {
              name: 'Ships',
              kind: 'tuple',
              type: [
                {
                  name: 'Vec<U8>',
                  kind: 'sequence',
                  type: {
                    name: 'U8',
                    kind: 'primitive',
                    type: 'U8',
                  },
                },
                {
                  name: 'Vec<U8>',
                  kind: 'sequence',
                  type: {
                    name: 'U8',
                    kind: 'primitive',
                    type: 'U8',
                  },
                },
                {
                  name: 'Vec<U8>',
                  kind: 'sequence',
                  type: {
                    name: 'U8',
                    kind: 'primitive',
                    type: 'U8',
                  },
                },
                {
                  name: 'Vec<U8>',
                  kind: 'sequence',
                  type: {
                    name: 'U8',
                    kind: 'primitive',
                    type: 'U8',
                  },
                },
              ],
            },
          },
        },
        Turn: {
          kind: 'composite',
          name: null,
          type: {
            step: {
              kind: 'primitive',
              name: 'U8',
              type: 'U8',
            },
          },
        },
      },
    });
    expect(meta.getTypeDef(meta.types.handle.input!)).toEqual({
      _variants: {
        StartGame: {
          ships: [['U8'], ['U8'], ['U8'], ['U8']],
        },
        Turn: {
          step: 'U8',
        },
      },
    });
  });

  test('create handle.input type', () => {
    expect(
      meta
        .createType(meta.types.handle.input!, {
          StartGame: {
            ships: [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]],
          },
        })
        .toHex(),
    ).toBe('0x0004010801020c0102031001020304');
  });
});
