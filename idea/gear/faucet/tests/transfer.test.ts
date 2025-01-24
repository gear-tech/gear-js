import { TransferService } from '../src/services';
import { GearService } from '../src/services';
import { AppDataSource, TransferBalance } from '../src/database';
import { JSONRPC_ERRORS } from 'gear-idea-common';

jest.mock('../src/database', () => {
  const actualModule = jest.requireActual('../src/database');
  return {
    ...actualModule,
    AppDataSource: {
      getRepository: jest.fn(),
    },
  };
});

jest.mock('../src/services', () => {
  const actualModule = jest.requireActual('../src/services');
  return {
    ...actualModule,
    GearService: jest.fn().mockImplementation(() => {
      return {
        requestBalance: jest.fn(),
        genesisHash: 'valid genesis hash',
      };
    }),
  };
});

const mockTransferRepository = {
  save: jest.fn(),
  findOneBy: jest.fn(),
};

describe('TransferService', () => {
  let transferService: TransferService;
  let gearService: jest.Mocked<GearService>;
  const validAddress = '0xae2903bc4bff501c4b40316bb288f0413c30d9221290a7d957cbd46810ceee10';
  const genesis = 'valid genesis hash';

  beforeEach(() => {
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      switch (entity) {
        case TransferBalance:
          return mockTransferRepository;
      }
    });
    gearService = new GearService() as jest.Mocked<GearService>;
    transferService = new TransferService(gearService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setTransferDate', () => {
    it('should save transfer date for the account', async () => {
      const transferBalance = new TransferBalance({ account: `${validAddress}.${genesis}`, lastTransfer: new Date() });

      mockTransferRepository.save.mockResolvedValue(transferBalance);

      const result = await transferService.setTransferDate(validAddress, genesis);

      expect(mockTransferRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ account: `${validAddress}.${genesis}` }),
      );
      expect(result).toEqual(transferBalance);
    });
  });

  describe('isPossibleToTransfer', () => {
    it('should return true if no previous transfer exists', async () => {
      mockTransferRepository.findOneBy.mockResolvedValue(null);

      const result = await transferService.isPossibleToTransfer(validAddress, genesis);

      expect(result).toBe(true);
    });

    it('should return true if last transfer was before today', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const transferBalance = new TransferBalance({ account: `${validAddress}.${genesis}`, lastTransfer: yesterday });

      mockTransferRepository.findOneBy.mockResolvedValue(transferBalance);

      const result = await transferService.isPossibleToTransfer(validAddress, genesis);

      expect(result).toBe(true);
    });

    it('should return false if last transfer was today', async () => {
      const today = new Date();
      const transferBalance = new TransferBalance({ account: `${validAddress}.${genesis}`, lastTransfer: today });

      mockTransferRepository.findOneBy.mockResolvedValue(transferBalance);

      const result = await transferService.isPossibleToTransfer(validAddress, genesis);

      expect(result).toBe(false);
    });
  });

  describe('transferBalance', () => {
    it('should return error if address is invalid', async () => {
      const result = await transferService.transferBalance({ address: 'invalid_address', genesis });

      expect(result).toEqual({ error: JSONRPC_ERRORS.InvalidAddress.name });
    });

    it('should return error if transfer limit is reached', async () => {
      const genesis = 'test_genesis';
      jest.spyOn(transferService, 'isPossibleToTransfer').mockResolvedValue(false);

      const result = await transferService.transferBalance({ address: validAddress, genesis });

      expect(result).toEqual({ error: JSONRPC_ERRORS.TransferLimitReached.name });
    });

    it('should successfully transfer balance', async () => {
      const transferredBalance = '100000';

      jest.spyOn(transferService, 'isPossibleToTransfer').mockResolvedValue(true);
      gearService.requestBalance.mockImplementation((addr, callback) => {
        callback(null, transferredBalance);
      });

      const result = await transferService.transferBalance({ address: validAddress, genesis });

      expect(result).toEqual({ result: { status: 'ok', transferredBalance } });
      expect(mockTransferRepository.save).toHaveBeenCalled();
    });

    it('should return error on internal error during transfer', async () => {
      jest.spyOn(transferService, 'isPossibleToTransfer').mockResolvedValue(true);
      gearService.requestBalance.mockImplementation((addr, callback) => {
        callback('Transfer failed', null);
      });

      const result = await transferService.transferBalance({ address: validAddress, genesis });

      expect(result).toEqual({ error: JSONRPC_ERRORS.InternalError.name });
      expect(mockTransferRepository.save).not.toHaveBeenCalled();
    });
  });
});
