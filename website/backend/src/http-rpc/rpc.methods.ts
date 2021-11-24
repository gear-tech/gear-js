import { GearNodeService } from 'src/gear-node/gear-node.service';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { ProgramsService } from 'src/programs/programs.service';
import { InvalidParamsError } from 'src/json-rpc/errors';
import { RpcMethods } from 'src/json-rpc/methods';
import { User } from 'src/users/entities/user.entity';
import { MessagesService } from 'src/messages/messages.service';
import { MetadataService } from 'src/metadata/metadata.service';

@Injectable()
export class HttpRpcMethods extends RpcMethods {
  constructor(
    private readonly gearService: GearNodeService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly programService: ProgramsService,
    private readonly messageService: MessagesService,
    private readonly metaService: MetadataService,
  ) {
    super();
  }

  private logger: Logger = new Logger('HttpRpcMethods');

  login = {
    github: async (user: User, params: any) => {
      if (!params || !params.code) {
        throw new InvalidParamsError();
      }
      return await this.authService.loginGithub(params.code);
    },

    telegram: async (user: User, params: any) => {
      if (!params) {
        throw new InvalidParamsError();
      }
      const result = await this.authService.loginTelegram(params);
      return result;
    },

    dev: async (user: User, params: any) => {
      const result = await this.authService.testLogin(+params.id);
      return result;
    },
  };

  user = {
    profile: async (user: User, params: any) => {
      return this.userService.profile(user);
    },

    addPublicKey: async (user: User, params: any) => {
      return null; // (await this.userService.addPublicKey(user, params.publicKey, params.publicKeyRaw))?.publicKey;
    },
  };

  program = {
    data: async (user: User, params: any) => {
      if (!params || !params.hash) {
        throw new InvalidParamsError();
      }
      return await this.programService.findProgram(params.hash);
    },

    allUser: async (user: User, params: any) => {
      return await this.programService.getAllUserPrograms(params?.publicKeyRaw, params?.limit, params?.offset);
    },

    addMeta: async (user: User, params: any) => {
      return await this.metaService.addMeta(params);
    },

    getMeta: async (user: User, params: any) => {
      return await this.metaService.getMeta(params.programId);
    },

    all: async (user: User, params: any) => {
      return await this.programService.getAllPrograms(params ? params.limit : null, params ? params.offset : null);
    },
    allNoGUI: async (user: User, params: any) => {
      return await this.gearService.getAllNoGUIPrograms();
    },
  };

  message = {
    all: async (user: User, params?: any) => {
      return await this.messageService.getAll(
        params?.destination,
        params?.isRead,
        params?.programId,
        params?.limit,
        params?.offset,
      );
    },

    countUnread: async (user: User, params: any) => {
      return await this.messageService.getCountUnread(params?.publicKeyRaw);
    },

    savePayload: async (user: User, params: any) => {
      return await this.messageService.saveSendedPayload(params?.messageId, params?.payload, params?.signature);
    },

    markAsRead: async (user: User, params: any) => {
      await this.messageService.markAsRead(params?.publicKeyRaw, params?.id);
      return 'ok';
    },
  };

  balance = {
    topUp: async (user: User, params: any) => {
      if (!params?.value) {
        throw new InvalidParamsError();
      }
      return await this.gearService.balanceTopUp(params?.publicKey, params.value);
    },
  };
}
