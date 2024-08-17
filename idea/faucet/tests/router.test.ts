import request from 'supertest';
import express from 'express';
import { initializeApp } from '../src/app';
import { JSONRPC_ERRORS } from '@gear-js/common';
import { TransferService, GearService } from '../src/services';

const token = 'test token';

jest.mock('../src/services', () => {
  const mockGearService = {
    genesisHash: 'mockedGenesisHash',
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
  let app: express.Application;
  let gearService: jest.Mocked<GearService> = new GearService() as jest.Mocked<GearService>;
  let transferService: jest.Mocked<TransferService> = new TransferService(gearService) as jest.Mocked<TransferService>;

  beforeEach(async () => {
    app = await initializeApp({ gearService, transferService });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call transferBalance and return result', async () => {
    const result = { result: { status: 'ok', transferredBalance: '100000' } };
    transferService.transferBalance.mockResolvedValue(result);

    const response = await request(app)
      .post('/balance')
      .send({ token, payload: { address: 'mockAddress', genesis: 'mockedGenesisHash' } });

    expect(transferService.transferBalance).toHaveBeenCalledWith({
      address: 'mockAddress',
      genesis: 'mockedGenesisHash',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(result.result);
  });

  it('should return 403 if no hCaptcha token presented', async () => {
    const response = await request(app).post('/balance').send({});

    expect(response.status).toBe(403);
  });

  it('should return 400 if address or genesis is missing', async () => {
    const payloads = [{ address: 'mockAddress' }, { genesis: 'mockedGenesisHash' }, {}];

    for (const payload of payloads) {
      const response = await request(app).post('/balance').send({ token, payload });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Address and genesis are required' });
    }
  });

  it('should return 400 if genesis is invalid', async () => {
    const response = await request(app)
      .post('/balance')
      .send({ token, payload: { address: 'mockAddress', genesis: 'invalidGenesis' } });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid genesis' });
  });

  it('should return 403 if address is invalid or transfer limit reached', async () => {
    const errors = [JSONRPC_ERRORS.InvalidAddress, JSONRPC_ERRORS.TransferLimitReached];

    for (const error of errors) {
      const result = { error: error.name };
      transferService.transferBalance.mockResolvedValue(result);

      const response = await request(app)
        .post('/balance')
        .send({ token, payload: { address: 'mockAddress', genesis: 'mockedGenesisHash' } });

      expect(transferService.transferBalance).toHaveBeenCalledWith({
        address: 'mockAddress',
        genesis: 'mockedGenesisHash',
      });
      expect(response.status).toBe(403);
      expect(response.body).toEqual(result);
    }
  });

  it('should return 500 if internal error', async () => {
    const result = { error: JSONRPC_ERRORS.InternalError.name };
    transferService.transferBalance.mockResolvedValue(result);

    const response = await request(app)
      .post('/balance')
      .send({ token, payload: { address: 'mockAddress', genesis: 'mockedGenesisHash' } });

    expect(transferService.transferBalance).toHaveBeenCalledWith({
      address: 'mockAddress',
      genesis: 'mockedGenesisHash',
    });
    expect(response.status).toBe(500);
    expect(response.body).toEqual(result);
  });
});
