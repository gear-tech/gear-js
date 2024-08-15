import { MetaService } from '../src/service';
import { Meta, SailsIdl, AppDataSource, Code } from '../src/database';
import {
  AddMetaDetailsParams,
  GetMetaParams,
  AddSailsIdlParams,
  InvalidMetadataError,
  MetaNotFoundError,
  SailsIdlNotFoundError,
  InvalidParamsError,
} from '@gear-js/common';

const validHex =
  '0x000200010000000001030000000107000000010400000001040000000000011a000000011b000000011d0000003d108400042042547265655365740404540104000400080000000400000503000800000204000c042042547265654d617008044b0110045601040004001400000010000005020014000002180018000004081004001c0830746573745f6d6574615f696f18416374696f6e0001180c4f6e6504002001384f7074696f6e3c537472696e673e0000000c54776f04002401185665633c583e0001001454687265650401186669656c6431340164526573756c743c2875382c20537472696e67292c206933323e00020010466f75720400400150536f6d655374727563743c753132382c2075383e00030010466976650400540154536f6d655374727563743c537472696e672c20583e0004000c536978080050011c4163746f724964000060012c456d707479537472756374000500002004184f7074696f6e04045401100108104e6f6e6500000010536f6d650400100000010000240000022800280830746573745f6d6574615f696f0458000004002c01242875382c207531362900002c00000408043000300000050400340418526573756c7408045401380445013c0108084f6b040038000000000c45727204003c000001000038000004080410003c0000050b00400830746573745f6d6574615f696f28536f6d655374727563740808503101440850320104000c011861727261793848011c5b50313b20385d00011c617272617933324c01205b50323b2033325d0001146163746f7250011c4163746f7249640000440000050700480000030800000044004c00000320000000040050082c677072696d6974697665731c4163746f724964000004004c01205b75383b2033325d0000540830746573745f6d6574615f696f28536f6d655374727563740808503101100850320128000c011861727261793858011c5b50313b20385d00011c617272617933325c01205b50323b2033325d0001146163746f7250011c4163746f7249640000580000030800000010005c000003200000002800600830746573745f6d6574615f696f2c456d7074795374727563740000040114656d7074796401082829000064000004000068083c7072696d69746976655f74797065731048323536000004004c01205b75383b2033325d00006c04184f7074696f6e04045401700108104e6f6e6500000010536f6d650400700000010000700000050500740000027800780830746573745f6d6574615f696f1857616c6c6574000008010869647c01084964000118706572736f6e800118506572736f6e00007c0830746573745f6d6574615f696f084964000008011c646563696d616c4401107531323800010c68657808011c5665633c75383e0000800830746573745f6d6574615f696f18506572736f6e000008011c7375726e616d65100118537472696e670001106e616d65100118537472696e670000';
const validHash = '0x4bea511a2b6f5bfdd7de71abbb7a7d41b781f3a85a3561b9d1207e180f35f965';
const validData =
  '\u0063\u006f\u006e\u0073\u0074\u0072\u0075\u0063\u0074\u006f\u0072\u0020\u007b\u000a\u0020\u0020\u004e\u0065\u0077\u0020\u003a\u0020\u0028\u0029\u003b\u000a\u007d\u003b\u000a\u000a\u0073\u0065\u0072\u0076\u0069\u0063\u0065\u0020\u0050\u0069\u006e\u0067\u0020\u007b\u000a\u0020\u0020\u0050\u0069\u006e\u0067\u0020\u003a\u0020\u0028\u0069\u006e\u0070\u0075\u0074\u003a\u0020\u0073\u0074\u0072\u0029\u0020\u002d\u003e\u0020\u0072\u0065\u0073\u0075\u006c\u0074\u0020\u0028\u0073\u0074\u0072\u002c\u0020\u0073\u0074\u0072\u0029\u003b\u000a\u007d\u003b\u000a\u000a';
const validCodeId = '0x273c789c30a54656d19451de5e0d761711879bcf09ecfd742a2d6228796289da';
const validIdlHash = '81d86bc5b5dea7751471a6cb89a2a53e24e3ecf65a8e9a16e3c0a661d3b392ff';

jest.mock('../src/database', () => {
  const actualModule = jest.requireActual('../src/database');

  return {
    ...actualModule,
    AppDataSource: {
      getRepository: jest.fn(),
    },
  };
});

const mockMetaRepo = {
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
};

const mockSailsRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockCodeRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('MetaService', () => {
  let metaService: MetaService;

  beforeEach(() => {
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      switch (entity) {
        case Meta:
          return mockMetaRepo;
        case SailsIdl:
          return mockSailsRepo;
        case Code:
          return mockCodeRepo;
      }
    });

    metaService = new MetaService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Add meta details', () => {
    it('should add and return meta details if not present', async () => {
      const params: AddMetaDetailsParams = {
        hex: validHex,
        hash: validHash,
      };

      mockMetaRepo.findOneBy.mockResolvedValue(null);

      const result = await metaService.addMetaDetails(params);

      expect(mockMetaRepo.findOneBy).toHaveBeenCalledWith({ hash: params.hash });
      expect(mockMetaRepo.save).toHaveBeenCalledWith(expect.objectContaining({ ...params, hasState: true }));
      expect(result).toEqual({ ...params, hasState: true });
    });

    it('should throw InvalidMetadataError on invalid metadata hex', async () => {
      const params: AddMetaDetailsParams = {
        hash: validHash,
        hex: '0xInvalidHex',
      };

      mockMetaRepo.findOneBy.mockResolvedValue(null);

      await expect(metaService.addMetaDetails(params)).rejects.toThrow(InvalidMetadataError);
    });
  });

  describe('Get meta details', () => {
    it('should return meta if found', async () => {
      const params: GetMetaParams = { hash: 'existingTestHash', hex: undefined };
      const mockMeta = { ...params, hex: 'testHex', hasState: true };

      mockMetaRepo.findOne.mockResolvedValue(mockMeta);

      const result = await metaService.get(params);

      expect(mockMetaRepo.findOne).toHaveBeenCalledWith({ where: { hash: params.hash } });
      expect(result).toEqual(mockMeta);
    });

    it('should throw MetaNotFoundError if meta not found', async () => {
      const params: GetMetaParams = { hash: 'testHash', hex: undefined };

      mockMetaRepo.findOne.mockResolvedValue(null);

      await expect(metaService.get(params)).rejects.toThrow(MetaNotFoundError);
    });
  });

  describe('Get all hashs with state equals true', () => {
    it('should return hashes of all metas with state', async () => {
      const mockMetas = [{ hash: 'hash1' }, { hash: 'hash2' }];

      mockMetaRepo.find.mockResolvedValue(mockMetas);

      const result = await metaService.getAllWithState();

      expect(mockMetaRepo.find).toHaveBeenCalledWith({ where: { hasState: true }, select: { hash: true } });
      expect(result).toEqual(['hash1', 'hash2']);
    });
  });

  describe('Add IDL', () => {
    it('should add IDL and return status', async () => {
      const params: AddSailsIdlParams = { codeId: validCodeId, data: validData };

      mockSailsRepo.findOne.mockResolvedValue(null);
      mockCodeRepo.findOne.mockResolvedValue(null);

      const result = await metaService.addIdl(params);

      expect(mockSailsRepo.findOne).toHaveBeenCalledWith({ where: { id: validIdlHash } });
      expect(mockSailsRepo.save).toHaveBeenCalled();
      expect(mockCodeRepo.save).toHaveBeenCalled();
      expect(result).toEqual({ status: 'Sails idl added' });
    });

    it('should throw InvalidParamsError if code already has IDL', async () => {
      const params: AddSailsIdlParams = { codeId: 'testCodeId', data: 'testData' };

      mockSailsRepo.findOne.mockResolvedValue(null);
      mockCodeRepo.findOne.mockResolvedValue({ id: params.codeId });

      await expect(metaService.addIdl(params)).rejects.toThrow(InvalidParamsError);
    });
  });

  describe('Get IDL', () => {
    it('should return IDL data if code found', async () => {
      const params = { codeId: 'testCodeId' };
      const mockCode = { id: 'testCodeId', sails: { data: 'testData' } };

      mockCodeRepo.findOne.mockResolvedValue(mockCode);

      const result = await metaService.getIdl(params);

      expect(mockCodeRepo.findOne).toHaveBeenCalledWith({ where: { id: params.codeId }, relations: { sails: true } });
      expect(result).toEqual(mockCode.sails.data);
    });

    it('should throw SailsIdlNotFoundError if code not found', async () => {
      const params = { codeId: 'testCodeId' };

      mockCodeRepo.findOne.mockResolvedValue(null);

      await expect(metaService.getIdl(params)).rejects.toThrow(SailsIdlNotFoundError);
    });
  });
});
