import { PROGRAMS_DIR } from './config';
import fs from 'fs';
import { join } from 'path';

import { ProgramMetadata, getProgramMetadata } from '../src';

let meta: ProgramMetadata;

beforeAll(() => {
  const hex = fs.readFileSync(join(PROGRAMS_DIR, 'test-meta/meta.txt'), 'utf-8');
  meta = getProgramMetadata(`0x${hex}`);
});

describe('Get type definitions', () => {
  test('Program Metadata', () => {
    expect(meta.types).toEqual({
      init: { input: 0, output: 3 },
      handle: { input: 7, output: 24 },
      reply: { input: 4, output: 26 },
      others: { input: null, output: null },
      signal: 27,
      state: 28,
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
    expect(meta.getTypeDef(26)).toEqual(['U16']);
    expect(meta.getTypeDef(26, true)).toEqual({
      name: 'Vec<U16>',
      kind: 'sequence',
      type: { name: 'U16', kind: 'primitive', type: 'U16' },
    });
    expect(meta.createType(26, [16, 17, 18]).toJSON()).toEqual([16, 17, 18]);
  });

  test('Get type structure 27', () => {
    expect(meta.getTypeDef(27)).toEqual('H256');
    expect(meta.getTypeDef(27, true)).toEqual({ kind: 'primitive', name: 'H256', type: 'H256' });
  });

  test('Get type structure 28', () => {
    expect(meta.getTypeDef(28)).toEqual([
      {
        id: {
          decimal: 'U128',
          hex: ['U8'],
        },
        person: {
          surname: 'Str',
          name: 'Str',
        },
      },
    ]);
    expect(meta.getTypeDef(28, true)).toEqual({
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
              decimal: { name: 'U128', kind: 'primitive', type: 'U128' },
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

  test('Get type structure 29', () => {
    expect(meta.getTypeDef(29)).toEqual({
      id: {
        decimal: 'U128',
        hex: ['U8'],
      },
      person: {
        surname: 'Str',
        name: 'Str',
      },
    });
    expect(meta.getTypeDef(29, true)).toEqual({
      name: 'Wallet',
      kind: 'composite',
      type: {
        id: {
          name: 'Id',
          kind: 'composite',
          type: {
            decimal: { name: 'U128', kind: 'primitive', type: 'U128' },
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

  test('Get type structure 30', () => {
    expect(meta.getTypeDef(30)).toEqual({
      decimal: 'U128',
      hex: ['U8'],
    });
    expect(meta.getTypeDef(30, true)).toEqual({
      name: 'Id',
      kind: 'composite',
      type: {
        decimal: { name: 'U128', kind: 'primitive', type: 'U128' },
        hex: { name: 'Vec<U8>', kind: 'sequence', type: { name: 'U8', kind: 'primitive', type: 'U8' } },
      },
    });
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
