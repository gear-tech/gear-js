import { GearNodeService } from 'src/gear-node/gear-node.service';
import { Injectable, Logger } from '@nestjs/common';
import { ProgramsService } from 'src/programs/programs.service';
import { InvalidParamsError } from 'src/json-rpc/errors';
import { RpcMethods } from 'src/json-rpc/methods';
import { MessagesService } from 'src/messages/messages.service';
import { MetadataService } from 'src/metadata/metadata.service';

@Injectable()
export class HttpRpcMethods extends RpcMethods {
  constructor(
    private readonly gearService: GearNodeService,
    private readonly programService: ProgramsService,
    private readonly messageService: MessagesService,
    private readonly metaService: MetadataService,
  ) {
    super();
  }

  private logger: Logger = new Logger('HttpRpcMethods');

  program = {
    data: async (params: any) => {
      if (!params || !params.hash) {
        throw new InvalidParamsError();
      }
      return await this.programService.findProgram(params.hash);
    },

    allUser: async (params: any) => {
      return await this.programService.getAllUserPrograms(
        params?.publicKeyRaw,
        params?.chain,
        params?.limit,
        params?.offset,
      );
    },

    addMeta: async (params: any) => {
      return await this.metaService.addMeta(params);
    },

    getMeta: async (params: any) => {
      return await this.metaService.getMeta(params.programId);
    },

    all: async (params: any) => {
      return await this.programService.getAllPrograms(params?.chain, params?.limit, params?.offset);
    },
    allNoGUI: async (params: any) => {
      return await this.gearService.getAllNoGUIPrograms();
    },
  };

  message = {
    all: async (params?: any) => {
      return await this.messageService.getAll(
        params?.destination,
        params?.isRead,
        params?.programId,
        params?.limit,
        params?.offset,
      );
    },

    countUnread: async (params: any) => {
      return await this.messageService.getCountUnread(params?.publicKeyRaw);
    },

    savePayload: async (params: any) => {
      return await this.messageService.saveSendedPayload(params?.messageId, params?.payload, params?.signature);
    },

    markAsRead: async (params: any) => {
      await this.messageService.markAsRead(params?.publicKeyRaw, params?.id);
      return 'ok';
    },
  };

  balance = {
    topUp: async (params: any) => {
      if (!params?.value) {
        throw new InvalidParamsError();
      }
      return await this.gearService.balanceTopUp(params?.publicKey, params.value);
    },
  };
}
