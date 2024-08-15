import request from 'supertest';
import { Express } from 'express';
import { main } from '../src/main';
import { MetaService } from '../src/service';
import { InvalidMetadataError, InvalidParamsError, MetaNotFoundError, SailsIdlNotFoundError } from '@gear-js/common';

jest.mock('../src/service', () => {
  return {
    MetaService: jest.fn().mockImplementation((): Partial<MetaService> => {
      return {
        get: jest.fn(),
        addMetaDetails: jest.fn(),
        addIdl: jest.fn(),
        getIdl: jest.fn(),
      };
    }),
  };
});

describe('Get meta details', () => {
  let app: Express;
  const metaService = new MetaService() as jest.Mocked<MetaService>;

  beforeEach(async () => {
    app = await main(metaService);
  });

  afterEach(() => {
    metaService.get.mockClear();
  });

  it('should return a successful response when fetching meta details', async () => {
    const validResult = {
      hash: '0x4bea511a2b6f5bfdd7de71abbb7a7d41b781f3a85a3561b9d1207e180f35f965',
      hex: 'result hex',
      hasState: true,
    };

    metaService.get.mockResolvedValue(validResult);

    const response = await request(app).get('/meta').query({ hash: validResult.hash });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(validResult);
    expect(metaService.get.mock.calls.length).toBe(1);
  });

  it('should return status code 400 when meta hash missing', async () => {
    const values = [{ hash: undefined }, {}];

    for (const value of values) {
      const response = await request(app).get('/meta').query(values);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing hash');
      expect(metaService.get.mock.calls.length).toBe(0);
    }
  });

  it('should return status code 404 when meta details not found', async () => {
    metaService.get.mockRejectedValue(new MetaNotFoundError());

    const response = await request(app).get('/meta').query({ hash: 'test hash' });

    expect(response.status).toBe(404);
    expect(metaService.get.mock.calls.length).toBe(1);
  });

  it('should return status code 500 when server internal error', async () => {
    metaService.get.mockRejectedValue(new Error());

    const response = await request(app).get('/meta').query({ hash: 'test hash' });

    expect(response.status).toBe(500);
    expect(metaService.get.mock.calls.length).toBe(1);
  });
});

describe('Add meta details', () => {
  let app: Express;
  const metaService = new MetaService() as jest.Mocked<MetaService>;

  beforeEach(async () => {
    app = await main(metaService);
  });

  afterEach(() => {
    metaService.addMetaDetails.mockClear();
  });

  it('should return a successful response when adding meta details', async () => {
    const validResult = {
      hash: '0x4bea511a2b6f5bfdd7de71abbb7a7d41b781f3a85a3561b9d1207e180f35f965',
      hex: 'result hex',
      hasState: true,
    };

    metaService.addMetaDetails.mockResolvedValue(validResult);

    const response = await request(app).post('/meta').send({ hash: validResult.hash, hex: validResult.hex });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(validResult);
    expect(metaService.addMetaDetails.mock.calls.length).toBe(1);
  });

  it('should return status code 400 when meta hash or hex missing', async () => {
    const values = [{ hash: 'test hash' }, { hex: 'test hex' }, {}];

    for (const value of values) {
      const response = await request(app).post('/meta').send(value);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing hash or hex');
      expect(metaService.addMetaDetails.mock.calls.length).toBe(0);
    }
  });

  it('should return status code 400 when invalid params or metadata', async () => {
    const errors = [new InvalidParamsError(), new InvalidMetadataError()];
    for (const error of errors) {
      metaService.addMetaDetails.mockClear();
      metaService.addMetaDetails.mockRejectedValue(error);

      const response = await request(app).post('/meta').send({ hash: 'test hash', hex: 'test hex' });

      expect(response.status).toBe(400);
      expect(metaService.addMetaDetails.mock.calls.length).toBe(1);
    }
  });

  it('should return status code 500 when server internal error', async () => {
    metaService.addMetaDetails.mockRejectedValue(new Error());

    const response = await request(app).post('/meta').send({ hash: 'test hash', hex: 'test hex' });

    expect(response.status).toBe(500);
    expect(metaService.addMetaDetails.mock.calls.length).toBe(1);
  });
});

describe('Get sails', () => {
  let app: Express;
  const metaService = new MetaService() as jest.Mocked<MetaService>;

  beforeEach(async () => {
    app = await main(metaService);
  });

  afterEach(() => {
    metaService.getIdl.mockClear();
  });

  it('should return a successful response when fetching sails', async () => {
    const validResult = {
      codeId: 'valid code id',
      data: 'data string',
    };

    metaService.getIdl.mockResolvedValue(validResult.data);

    const response = await request(app).get('/sails').query({ codeId: validResult.codeId });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(validResult);
    expect(metaService.getIdl.mock.calls.length).toBe(1);
  });

  it('should return status code 400 when missing codeId', async () => {
    const response = await request(app).get('/sails').query({});

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual('Missing codeId');
    expect(metaService.getIdl.mock.calls.length).toBe(0);
  });

  it('should return status code 404 when data for codeId not found', async () => {
    metaService.getIdl.mockRejectedValue(new SailsIdlNotFoundError());

    const response = await request(app).get('/sails').query({ codeId: 'test codeId' });

    expect(response.status).toBe(404);
    expect(metaService.getIdl.mock.calls.length).toBe(1);
  });

  it('should return status code 500 when internal server error', async () => {
    metaService.getIdl.mockRejectedValue(new Error());

    const response = await request(app).get('/sails').query({ codeId: 'test codeId' });

    expect(response.status).toBe(500);
    expect(metaService.getIdl.mock.calls.length).toBe(1);
  });
});

describe('Add sails', () => {
  let app: Express;
  const metaService = new MetaService() as jest.Mocked<MetaService>;

  beforeEach(async () => {
    app = await main(metaService);
  });

  afterEach(() => {
    metaService.addIdl.mockClear();
  });

  it('should return a successful response when fetching sails', async () => {
    const validResult = { status: 'Sails idl added' };

    metaService.addIdl.mockResolvedValue(validResult);

    const response = await request(app).post('/sails').send({
      codeId: 'valid code id',
      data: 'data string',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(validResult);
    expect(metaService.addIdl.mock.calls.length).toBe(1);
  });

  it('should return status code 400 when missing codeId or data', async () => {
    const values = [{ codeId: 'valid code id' }, { data: 'data string' }, {}];

    for (const value of values) {
      const response = await request(app).post('/sails').send(value);

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual('Missing codeId or data');
      expect(metaService.addIdl.mock.calls.length).toBe(0);
    }
  });

  it('should return status code 400 when invalid params', async () => {
    metaService.addIdl.mockRejectedValue(new InvalidParamsError());
    const response = await request(app).post('/sails').send({ codeId: 'test code id', data: 'test data' });

    expect(response.status).toBe(400);
    expect(metaService.addIdl.mock.calls.length).toBe(1);
  });

  it('should return status code 500 when internal server error', async () => {
    metaService.addIdl.mockRejectedValue(new Error());
    const response = await request(app).post('/sails').send({ codeId: 'test code id', data: 'test data' });

    expect(response.status).toBe(500);
    expect(metaService.addIdl.mock.calls.length).toBe(1);
  });
});
