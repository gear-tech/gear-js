import { Controller, Sse } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiRx, WsProvider } from '@polkadot/api';
import { BlocksService } from './blocks.service';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Sse('last')
  async sse() {
    const api = await this.blocksService.getApi();

    return api.rpc.chain.subscribeNewHeads().pipe(
      map((header) => ({
        data: {
          hash: header.hash,
          number: header.number,
          time: new Date(),
        },
      })),
    );
  }
}
