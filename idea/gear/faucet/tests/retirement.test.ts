import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import config from '../src/config.js';
import { FaucetRequest, FaucetType, RequestStatus } from '../src/database/index.js';
import { Server } from '../src/server.js';
import { LastSeenService, RequestService } from '../src/services/index.js';
import { repos } from './__mocks__/db.js';

const ADDRESS = '0x0000000000000000000000000000000000000001';
const GENESIS = '0x525639f713f397dcf839bd022cd821f367ebcf179de7b9253531f8adbe5436d6';

describe('Retired Substrate faucet', () => {
  let service: RequestService;

  beforeEach(() => {
    repos.FaucetRequest.clear();
    repos.UserLastSeen.clear();
    service = new RequestService(new LastSeenService());
  });

  it.each([
    '/vara-testnet/request',
    '/agent/vara-testnet/request',
    '/balance',
    '/agent/challenge',
  ])('%s follows the unknown-route policy without writing to the database', async (path) => {
    const server = new Server(service, true, true, false);
    const response = await request(server.app).post(path).send({ address: ADDRESS, genesis: GENESIS });

    expect(response.status).toBe(404);
    expect(response.headers.location).toBeUndefined();
    expect(repos.FaucetRequest._data()).toEqual({});
    expect(repos.UserLastSeen._data()).toEqual({});
  });

  it.each([
    FaucetType.VaraTestnet,
    FaucetType.BridgeVaraTestnet,
  ])('rejects retired request type %s even with a supported ERC20 target', async (type) => {
    await expect(service.newRequest(ADDRESS, config.bridge.erc20Contracts[0][0], type)).rejects.toMatchObject({
      code: 400,
    });
    expect(repos.FaucetRequest._data()).toEqual({});
  });

  it('does not accept a WVARA request for a different bridge contract', async () => {
    await expect(
      service.newRequest(ADDRESS, config.bridge.erc20Contracts[0][0], FaucetType.WVara),
    ).rejects.toMatchObject({ code: 400 });
  });

  it('preserves historical rows while recovering and processing the active queue', async () => {
    const historical = [FaucetType.VaraTestnet, FaucetType.BridgeVaraTestnet].flatMap((type) =>
      [RequestStatus.Pending, RequestStatus.Processing, RequestStatus.Completed, RequestStatus.Failed].map(
        (status) => new FaucetRequest({ type, status, address: ADDRESS, target: GENESIS }),
      ),
    );
    await repos.FaucetRequest.save(historical);
    const snapshot = JSON.stringify(repos.FaucetRequest._data());

    await service.resetProcessing();
    expect(await service.getRequestsToProcess([FaucetType.BridgeErc20, FaucetType.WVara])).toEqual([]);
    expect(JSON.stringify(repos.FaucetRequest._data())).toBe(snapshot);

    for (const type of [FaucetType.BridgeErc20, FaucetType.WVara]) {
      await repos.FaucetRequest.save(
        new FaucetRequest({ type, status: RequestStatus.Processing, address: ADDRESS, target: config.wvara.address }),
      );
    }
    await service.resetProcessing();
    const rows = Object.values(repos.FaucetRequest._data());
    expect(rows.slice(-2).map(({ status }) => status)).toEqual([RequestStatus.Failed, RequestStatus.Failed]);
    expect(JSON.stringify(Object.fromEntries(rows.slice(0, 8).map((row) => [row.id, row])))).toBe(snapshot);
  });
});
