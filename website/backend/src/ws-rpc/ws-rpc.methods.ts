import { GearNodeService } from 'src/gear-node/gear-node.service';
import { Injectable, Logger } from '@nestjs/common';
import { RpcMethods } from 'src/json-rpc/methods';
import { InvalidParamsError } from 'src/json-rpc/errors';
import { MessagesService } from 'src/messages/messages.service';
import { User } from 'src/users/entities/user.entity';
import { MetadataService } from 'src/metadata/metadata.service';

@Injectable()
export class WsRpcMethods extends RpcMethods {
  constructor(
    private readonly gearService: GearNodeService,
    private readonly messageService: MessagesService,
    private readonly metaService: MetadataService,
  ) {
    super();
  }

  private logger: Logger = new Logger('WsRpcMethods');

  balance = {
    transfer: async (cb, user, params) => {
      if (!params || !params.value) {
        throw new InvalidParamsError();
      }
      await this.gearService.balanceTransfer(
        {
          to: user.publicKey,
          value: params.value,
        },
        cb,
      );
    },
  };

  message = {
    gasSpent: async (cb, user, params) => {
      try {
        const gasSpent = await this.gearService.getGasSpent(params.destination, params.payload);
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
        const type = await this.metaService.getMeta(params.destination);
        cb(undefined, {
          payloadType: type,
        });
      } catch (error) {
        throw error;
      }
      return null;
    },

    markAsRead: async (cb, user: User, params: any) => {
      await this.messageService.markAsRead(user.publicKeyRaw, params.id);
    },
  };
}
