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
}
