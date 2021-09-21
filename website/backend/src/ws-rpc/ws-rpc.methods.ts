import { GearNodeService } from 'src/gear-node/gear-node.service';
import { Injectable, Logger } from '@nestjs/common';
import { RpcMethods } from 'src/json-rpc/methods';
import { InvalidParamsError } from 'src/json-rpc/errors';
import { MessagesService } from 'src/messages/messages.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WsRpcMethods extends RpcMethods {
  constructor(
    private readonly gearService: GearNodeService,
    private readonly messageService: MessagesService,
  ) {
    super();
  }

  private logger: Logger = new Logger('WsRpcMethods');

  program = {
    upload: async (cb, user, params) => {
      try {
        await this.gearService.uploadProgram(user, params, cb);
      } catch (error) {
        throw error;
      }
      return null;
    },
    addMeta: async (cb, user, params) => {
      try {
        await this.gearService.addMetadata(
          user,
          {
            programId: params.programId,
            file: params.meta_file,
            types: params.meta,
          },
          cb,
        );
      } catch (error) {
        throw error;
      }
      return null;
    },
  };

  blocks = {
    newBlocks: async (cb) => {
      const unsub = await this.gearService.subscribeNewHeads(cb);
      return { name: 'blocks', unsub: unsub };
    },
    unsubscribe: () => {
      return { name: 'blocks', unsub: null };
    },
  };

  system = {
    totalIssuance: async (cb) => {
      let total;
      try {
        total = await this.gearService.totalIssuance();
      } catch (error) {
        cb({ code: -32002, message: error.message });
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
      await this.gearService.balanceTransfer({
        to: user.publicKey,
        value: params.value,
        cb: cb,
      });
    },
  };

  message = {
    send: async (cb, user, params) => {
      await this.gearService.sendMessage(user, params, cb);
      return null;
    },
    gasSpent: async (cb, user, params) => {
      try {
        const gasSpent = await this.gearService.getGasSpent(
          params.destination,
          params.payload,
        );
        cb(undefined, {
          gasSpent: gasSpent,
        });
      } catch (error) {
        cb({ code: -32002, message: error.message });
      }
      return null;
    },
    payloadType: async (cb, user, params) => {
      try {
        const type = await this.gearService.getMeta(params.destination);
        cb(undefined, {
          payloadType: type,
        });
      } catch (error) {
        throw error;
      }
      return null;
    },

    markAsRead: async (cb, user: User, params: any) => {
      await this.messageService.markAsRead(user, params.id);
    },
  };

  events = {
    subscribe: async (cb, user) => {
      const unsub = await this.gearService.subscribeEvents(user, cb);
      return { name: 'events', unsub: unsub };
    },
    unsubscribe: () => {
      return { name: 'events', unsub: null };
    },
  };
}
