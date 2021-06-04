import { Injectable } from '@nestjs/common';
import { ApiRx, WsProvider } from '@polkadot/api';

@Injectable()
export class BlocksService {
  async getApi() {
    const provider = new WsProvider(process.env.WS_PROVIDER);

    return await ApiRx.create({ provider }).toPromise();
  }
}
