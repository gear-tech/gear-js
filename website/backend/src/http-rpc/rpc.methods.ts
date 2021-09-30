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
    github: async (user, params) => {
      if (!params || !params.code) {
        throw new InvalidParamsError();
      }
      return await this.authService.loginGithub(params.code);
    },

    telegram: async (user, params) => {
      if (!params) {
        throw new InvalidParamsError();
      }
      const result = await this.authService.loginTelegram(params);
      return result;
    },

    dev: async (user, params) => {
      const result = await this.authService.testLogin(+params.id);
      return result;
    },
  };

  user = {
    profile: async (user, params?) => {
      return this.userService.profile(user);
    },

    addPublicKey: async (user, params) => {
      return (
        await this.userService.addPublicKey(
          user,
          params.publicKey,
          params.publicKeyRaw,
        )
      ).publicKey;
    },

    getBalance: async (user, params?) => {
      return await this.gearService.getBalance(user.publicKey);
    },
  };

  program = {
    data: async (user, params) => {
      if (!params || !params.hash) {
        throw new InvalidParamsError();
      }
      return await this.programService.findProgram(params.hash);
    },

    allUser: async (user, params?) => {
      return await this.programService.getAllUserPrograms(
        user,
        params ? params.limit : null,
        params ? params.offset : null,
      );
    },

    addMeta: async (user, params) => {
      return await this.metaService.addMeta(
        params.signature,
        params.meta,
        params.publicKeyRaw,
        params.programId,
      );
    },

    getMeta: async (user, params) => {
      return await this.metaService.getMeta(params.programId);
    },

    all: async (user, params?) => {
      return await this.programService.getAllPrograms(
        params ? params.limit : null,
        params ? params.offset : null,
      );
    },
    allNoGUI: async (user, params) => {
      return await this.gearService.getAllNoGUIPrograms();
    },
  };

  message = {
    all: async (user: User, params?: any) => {
      return await this.messageService.getAll(
        user,
        params ? params.isRead : undefined,
        params ? params.programId : undefined,
        params ? params.limit : undefined,
        params ? params.offset : undefined,
      );
    },

    countUnread: async (user, params?) => {
      return await this.messageService.getCountUnread(user);
    },
  };
}
