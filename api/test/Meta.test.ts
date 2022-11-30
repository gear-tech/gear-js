import { CreateType, ProgramApi } from '../src';
import { writeFileSync } from 'fs';

describe('Create type test', () => {
  let programApi: ProgramApi;
  test.only('Program Metadata', () => {
    const hex =
      '0x01000000000103000000010700000001180000000104000000011a0000000000011b000000bd0e8000042042547265655365740404540104000400080000000400000503000800000204000c042042547265654d617008044b0110045601040004001400000010000005020014000002180018000004081004001c0830746573745f6d6574615f696f18416374696f6e0001140c4f6e6504002001384f7074696f6e3c537472696e673e0000000c54776f04002401185665633c583e0001001454687265650401186669656c6431340164526573756c743c2875382c20537472696e67292c206933323e00020010466f75720400400150536f6d655374727563743c753132382c2075383e00030010466976650400540154536f6d655374727563743c537472696e672c20583e000400002004184f7074696f6e04045401100108104e6f6e6500000010536f6d650400100000010000240000022800280830746573745f6d6574615f696f0458000004002c01242875382c207531362900002c00000408043000300000050400340418526573756c7408045401380445013c0108084f6b040038000000000c45727204003c000001000038000004080410003c0000050b00400830746573745f6d6574615f696f28536f6d655374727563740808503101440850320104000c011861727261793848011c5b50313b20385d00011c617272617933324c01205b50323b2033325d0001146163746f7250011c4163746f7249640000440000050700480000030800000044004c0000032000000004005010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004004c01205b75383b2033325d0000540830746573745f6d6574615f696f28536f6d655374727563740808503101100850320128000c011861727261793858011c5b50313b20385d00011c617272617933325c01205b50323b2033325d0001146163746f7250011c4163746f7249640000580000030800000010005c000003200000002800600830746573745f6d6574615f696f2c456d7074795374727563740000040114656d707479640108282900006400000400006800000230006c0000027000700830746573745f6d6574615f696f1857616c6c6574000008010869647401084964000118706572736f6e7c0118506572736f6e0000740830746573745f6d6574615f696f084964000008011c646563696d616c78010c75363400010c68657808011c5665633c75383e00007800000506007c0830746573745f6d6574615f696f18506572736f6e000008011c7375726e616d65100118537472696e670001106e616d65100118537472696e670000';
    programApi = new ProgramApi(hex);
    // console.log(programApi.metadata);
    expect(programApi.metadata).toEqual({
      init: { input: 0, output: 3 },
      handle: { input: 7, output: 24 },
      reply: { input: 4, output: 26 },
      others: { input: null, output: null },
      state: 27,
      reg: '0x8000042042547265655365740404540104000400080000000400000503000800000204000c042042547265654d617008044b0110045601040004001400000010000005020014000002180018000004081004001c0830746573745f6d6574615f696f18416374696f6e0001140c4f6e6504002001384f7074696f6e3c537472696e673e0000000c54776f04002401185665633c583e0001001454687265650401186669656c6431340164526573756c743c2875382c20537472696e67292c206933323e00020010466f75720400400150536f6d655374727563743c753132382c2075383e00030010466976650400540154536f6d655374727563743c537472696e672c20583e000400002004184f7074696f6e04045401100108104e6f6e6500000010536f6d650400100000010000240000022800280830746573745f6d6574615f696f0458000004002c01242875382c207531362900002c00000408043000300000050400340418526573756c7408045401380445013c0108084f6b040038000000000c45727204003c000001000038000004080410003c0000050b00400830746573745f6d6574615f696f28536f6d655374727563740808503101440850320104000c011861727261793848011c5b50313b20385d00011c617272617933324c01205b50323b2033325d0001146163746f7250011c4163746f7249640000440000050700480000030800000044004c0000032000000004005010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004004c01205b75383b2033325d0000540830746573745f6d6574615f696f28536f6d655374727563740808503101100850320128000c011861727261793858011c5b50313b20385d00011c617272617933325c01205b50323b2033325d0001146163746f7250011c4163746f7249640000580000030800000010005c000003200000002800600830746573745f6d6574615f696f2c456d7074795374727563740000040114656d707479640108282900006400000400006800000230006c0000027000700830746573745f6d6574615f696f1857616c6c6574000008010869647401084964000118706572736f6e7c0118506572736f6e0000740830746573745f6d6574615f696f084964000008011c646563696d616c78010c75363400010c68657808011c5665633c75383e00007800000506007c0830746573745f6d6574615f696f18506572736f6e000008011c7375726e616d65100118537472696e670001106e616d65100118537472696e670000',
    });
  });

  test.only('Get type structure 0', () => {
    expect(programApi.getTypeDef(0)).toEqual(['U8']);
  });
  test.only('Get type structure 1', () => {
    expect(programApi.getTypeDef(1)).toEqual('U8');
  });
  test.only('Get type structure 2', () => {
    expect(programApi.getTypeDef(2)).toEqual(['U8']);
  });
  test.only('Get type structure 3', () => {
    expect(programApi.getTypeDef(3)).toEqual([['Str', 'U8']]);
  });
  test.only('Get type structure 4', () => {
    expect(programApi.getTypeDef(4)).toEqual('Str');
  });
  test.only('Get type structure 5', () => {
    expect(programApi.getTypeDef(5)).toEqual([['Str', 'U8']]);
  });
  test.only('Get type structure 6', () => {
    expect(programApi.getTypeDef(6)).toEqual(['Str', 'U8']);
  });
  test.only('Get type structure 7', () => {
    expect(programApi.getTypeDef(7)).toEqual({
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
  });
  test.only('Get type structure 8', () => {
    expect(programApi.getTypeDef(8)).toEqual({
      _variants: {
        None: null,
        Some: 'Str',
      },
    });
  });
  test.only('Get type structure 9', () => {
    expect(programApi.getTypeDef(9)).toEqual([['U8', 'U16']]);
  });
  test.only('Get type structure 10', () => {
    expect(programApi.getTypeDef(10)).toEqual(['U8', 'U16']);
  });
  test.only('Get type structure 11', () => {
    expect(programApi.getTypeDef(11)).toEqual(['U8', 'U16']);
  });
  test.only('Get type structure 12', () => {
    expect(programApi.getTypeDef(12)).toEqual('U16');
  });
  test.only('Get type structure 13', () => {
    expect(programApi.getTypeDef(13)).toEqual({
      _variants: {
        Ok: ['U8', 'Str'],
        Err: 'I32',
      },
    });
  });
  test.only('Get type structure 14', () => {
    expect(programApi.getTypeDef(14)).toEqual(['U8', 'Str']);
  });
  test.only('Get type structure 15', () => {
    expect(programApi.getTypeDef(15)).toEqual('I32');
  });
  test.only('Get type structure 16', () => {
    expect(programApi.getTypeDef(16)).toEqual({
      array8: ['U128', 8],
      array32: ['U8', 32],
      actor: ['U8', 32],
    });
  });
  test.only('Get type structure 17', () => {
    expect(programApi.getTypeDef(17)).toEqual('U128');
  });
  test.only('Get type structure 18', () => {
    expect(programApi.getTypeDef(18)).toEqual(['U128', 8]);
  });
  test.only('Get type structure 19', () => {
    expect(programApi.getTypeDef(19)).toEqual(['U8', 32]);
  });
  test.only('Get type structure 20', () => {
    expect(programApi.getTypeDef(20)).toEqual(['U8', 32]); //??? ActorId
  });
  test.only('Get type structure 21', () => {
    expect(programApi.getTypeDef(21)).toEqual({
      array8: ['Str', 8],
      array32: [['U8', 'U16'], 32],
      actor: ['U8', 32],
    });
  });
  test.only('Get type structure 22', () => {
    expect(programApi.getTypeDef(22)).toEqual(['Str', 8]);
  });
  test.only('Get type structure 23', () => {
    expect(programApi.getTypeDef(23)).toEqual([['U8', 'U16'], 32]);
  });
  test.only('Get type structure 24', () => {
    expect(programApi.getTypeDef(24)).toEqual({ empty: null });
  });
  test.only('Get type structure 25', () => {
    expect(programApi.getTypeDef(25)).toEqual(null);
  });
  test.only('Get type structure 26', () => {
    expect(programApi.getTypeDef(26)).toEqual(['U16']);
  });
  test.only('Get type structure 27', () => {
    expect(programApi.getTypeDef(27)).toEqual([
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
  });
  test.only('Get type structure 28', () => {
    expect(programApi.getTypeDef(28)).toEqual({
      id: {
        decimal: 'U64',
        hex: ['U8'],
      },
      person: {
        surname: 'Str',
        name: 'Str',
      },
    });
  });
  test.only('Get type structure 29', () => {
    expect(programApi.getTypeDef(29)).toEqual({
      decimal: 'U64',
      hex: ['U8'],
    });
  });
  test.only('Get type structure 30', () => {
    expect(programApi.getTypeDef(30)).toEqual('U64');
  });
  test.only('Get type structure 31', () => {
    expect(programApi.getTypeDef(31)).toEqual({
      surname: 'Str',
      name: 'Str',
    });
  });

  test('Create init.input type', () => {
    const encoded = programApi.createType(programApi.metadata.init.input!, { amount: 8, currency: 'USD' });
    expect(encoded.toHex()).toBe('0x080c555344');
    expect(encoded.toJSON()).toEqual({ amount: 8, currency: 'USD' });
  });

  test('Create init.output type', () => {
    let encoded = programApi.createType(programApi.metadata.init.output!, { exchangeRate: { ok: 0 }, sum: 8 });
    expect(encoded.toHex()).toBe('0x000008');
    expect(encoded.toJSON()).toEqual({ exchangeRate: { ok: 0 }, sum: 8 });

    encoded = programApi.createType(programApi.metadata.init.output!, { exchangeRate: { err: 1 }, sum: 8 });
    expect(encoded.toHex()).toBe('0x010108');
    expect(encoded.toJSON()).toEqual({ exchangeRate: { err: 1 }, sum: 8 });
  });

  test('Create handle.input type', () => {
    const encoded = programApi.createType(programApi.metadata.handle.input!, { id: { decimal: 64, hex: '0x6464' } });
    expect(encoded.toHex()).toBe('0x4000000000000000086464');
    expect(encoded.toJSON()).toEqual({ id: { decimal: 64, hex: '0x6464' } });
  });

  test('Create handle.output type', () => {
    let encoded = programApi.createType(programApi.metadata.handle.output!, { res: null });
    expect(encoded.toHex()).toBe('0x00');
    expect(encoded.toJSON()).toEqual({ res: null });

    encoded = programApi.createType(programApi.metadata.handle.output!, {
      res: { id: { decimal: 64, hex: '0x6464' }, person: { surname: 'Alicova', name: 'Alice' } },
    });
    expect(encoded.toHex()).toBe('0x0140000000000000000864641c416c69636f766114416c696365');
    expect(encoded.toJSON()).toEqual({
      res: { id: { decimal: 64, hex: '0x6464' }, person: { surname: 'Alicova', name: 'Alice' } },
    });
  });

  test('Create others.input type', () => {
    const encoded = programApi.createType(programApi.metadata.others.input!, { empty: null });
    expect(encoded.toHex()).toBe('0x');
    expect(encoded.toJSON()).toEqual({ empty: null });
  });

  test('Create others.output type', () => {
    let encoded = programApi.createType(programApi.metadata.others.output!, { some: 7 });
    expect(encoded.toHex()).toBe('0x07');
    expect(encoded.toJSON()).toEqual(7);

    encoded = programApi.createType(programApi.metadata.others.output!, null);
    expect(encoded.toHex()).toBe('0x');
    expect(encoded.toJSON()).toEqual(null);
  });

  test('Create state type', () => {
    const encoded = programApi.createType(programApi.metadata.state!, [
      { id: { decimal: 64, hex: '0x6464' }, person: { surname: 'Alicova', name: 'Alice' } },
      { id: { decimal: 32, hex: '0x3232' }, person: { surname: 'Bobov', name: 'Bob' } },
    ]);
    expect(encoded.toHex()).toBe(
      '0x0840000000000000000864641c416c69636f766114416c696365200000000000000008323214426f626f760c426f62',
    );
    expect(encoded.toJSON()).toEqual([
      { id: { decimal: 64, hex: '0x6464' }, person: { surname: 'Alicova', name: 'Alice' } },
      { id: { decimal: 32, hex: '0x3232' }, person: { surname: 'Bobov', name: 'Bob' } },
    ]);
    programApi.getTypeDef(programApi.metadata.state!);
  });
});
