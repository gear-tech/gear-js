import { Injectable } from '@nestjs/common';
import { ApiPromise, ApiRx, WsProvider } from '@polkadot/api';
import { map } from 'rxjs/operators';

@Injectable()
export class BlocksService {
  async getApiRx() {
    const provider = new WsProvider(process.env.WS_PROVIDER);
    return await ApiRx.create({ provider }).toPromise();
  }

  async getApiPromise() {
    const provider = new WsProvider(process.env.WS_PROVIDER);
    return await ApiPromise.create({ provider });
  }

  async subscribeNewHeads() {
    const api = await this.getApiRx();

    return api.rpc.chain.subscribeNewHeads().pipe(
      map((header) => ({
        data: {
          hash: header.hash,
          number: header.number,
          time: new Date().toLocaleString(),
        },
      })),
    );
  }
}
