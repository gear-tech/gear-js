const genesisHash = 'mockedGenesisHash';

import { Request, Response } from 'express';
import { BalanceService } from '../src/general.router';
import { TransferService, GearService } from '../src/services';
import { JSONRPC_ERRORS } from '@gear-js/common';

jest.mock('../src/services', () => {
  const mockGearService = {
    genesisHash: genesisHash,
  };

  return {
    GearService: jest.fn().mockImplementation(() => mockGearService),

    TransferService: jest.fn().mockImplementation((gearService) => {
      return {
        gearService,
        transferBalance: jest.fn(),
      };
    }),
  };
});

describe('BalanceService', () => {
  let transferService: TransferService;
  let gearService: GearService;
  let balanceService: BalanceService;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    gearService = new GearService();
    transferService = new TransferService(gearService);

    balanceService = new BalanceService(transferService, gearService);
    balanceService.init();

    req = {
      body: {
        payload: {
          address: 'mockAddress',
          genesis: genesisHash,
        },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 if address or genesis is missing', () => {
    const payloads = [{ address: 'mockAddress' }, { genesis: genesisHash }, {}];

    for (const payload of payloads) {
      req.body.payload = payload;

      balanceService['handleBalance'](req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Address and genesis are required' });
    }
  });

  it('should return 400 if genesis is invalid', () => {
    req.body.payload.genesis = 'invalidGenesis';

    balanceService['handleBalance'](req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid genesis' });
  });

  it('should return 403 if address is invalid or transfer limit reached', async () => {
    const errors = [JSONRPC_ERRORS.InvalidAddress, JSONRPC_ERRORS.TransferLimitReached];

    for (const error of errors) {
      const result = { error: error.name };
      (transferService.transferBalance as jest.Mock).mockResolvedValue(result);

      await balanceService['handleBalance'](req as Request, res as Response);

      expect(transferService.transferBalance).toHaveBeenCalledWith(req.body.payload);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(result);
    }
  });

  it('should return 500 if internal error', async () => {
    const result = { error: JSONRPC_ERRORS.InternalError.name };
    (transferService.transferBalance as jest.Mock).mockResolvedValue(result);

    await balanceService['handleBalance'](req as Request, res as Response);

    expect(transferService.transferBalance).toHaveBeenCalledWith(req.body.payload);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('should call transferBalance and return result', async () => {
    const result = { result: { status: 'ok', transferredBalance: 100_000 } };
    (transferService.transferBalance as jest.Mock).mockResolvedValue(result);

    await balanceService['handleBalance'](req as Request, res as Response);

    expect(transferService.transferBalance).toHaveBeenCalledWith(req.body.payload);
    expect(res.json).toHaveBeenCalledWith(result.result);
  });
});
