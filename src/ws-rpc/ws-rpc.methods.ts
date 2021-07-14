import { GearNodeService } from 'src/gear-node/gear-node.service';
import { Injectable, Logger } from '@nestjs/common';
import { RpcMethods } from 'src/json-rpc/methods';
import { InvalidParamsError } from 'src/json-rpc/errors';

@Injectable()
export class WsRpcMethods extends RpcMethods {
  constructor(private readonly gearService: GearNodeService) {
    super();
  }

  private logger: Logger = new Logger('WsRpcMethods');

  program = {
    upload: async (cb, user, params) => {
      await this.gearService.uploadProgram(user, params, cb);
      return null;
    },
  };

  blocks = {
    newBlocks: async (cb) => {
      const unsub = await this.gearService.subscribeNewHeads(cb);
      return unsub;
    },
  };

  system = {
    totalIssuance: async (cb) => {
      let total;
      try {
        total = await this.gearService.totalIssuance();
      } catch (error) {
        cb({
          code: -32002,
          message: error.message,
        });
        return null;
      }
      cb(undefined, {
        totalIssuance: total,
      });
      return null;
    },
  };

  balance = {
    transfer: async (cb, user, params) => {
      if (!params || !params.value) {
        throw new InvalidParamsError();
      }
      return await this.gearService.balanceTransfer(
        user.publicKey,
        params.value,
        cb,
      );
    },
  };

  message = {
    send: async (cb, user, params) => {
      return await this.gearService.sendMessage(user, params, cb);
    },
  };
}
