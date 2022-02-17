import fetch from 'node-fetch';
import { array, number, object } from 'zod';

import { GearApi } from '@gear-js/api';

type Id = `0x${string}`;

const providerAddress = process.env.WS_PROVIDER || 'ws://127.0.0.1:9944/';
const apiBaseAddress = process.env.API_GATEWAY || 'http://127.0.0.1:3000/api';

const genesis = '0x70f04c10c85b57482a63514576e6fab6b0df4ddcfbfdf1da8f03dc3f59ba5439';

describe('Gear API', () => {
  let api: GearApi;
  beforeAll(async () => {
    api = await GearApi.create({ providerAddress });

    // Waiting until the Gateway goes up:
    // await new Promise((resolve) => setTimeout(resolve, 10240));
  }, 20480);
  afterAll(async () => {
    await api.disconnect();

    // Looks like `api.disconnect` leaks as of `@polkadot/api@7.3.1`.
    await new Promise((resolve) => setTimeout(resolve, 4096));
  });

  it('should list a non-zero number of programs', async () => {
    expect(api.isReady).toBeTruthy();

    const response = await fetch(apiBaseAddress, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 0,
        method: 'program.all',
        params: { genesis },
      }),
    });

    const { id, result } = object({
      id: number(),
      result: object({ count: number(), programs: array(object({}).passthrough()) }),
    }).parse(await response.json());

    const { arrayContaining, objectContaining } = expect;

    expect(id).toEqual(0);
    expect(result.count).toBeGreaterThan(0);
    expect(result.programs).toEqual(arrayContaining([objectContaining({ genesis })]));
  });
});
