import { GearNodeService } from 'src/gear-node/gear-node.service';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { ProgramsService } from 'src/programs/programs.service';
import { InvalidParamsError } from 'src/json-rpc/errors';
import { RpcMethods } from 'src/json-rpc/methods';

@Injectable()
export class HttpRpcMethods extends RpcMethods {
  constructor(
    private readonly gearService: GearNodeService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly programService: ProgramsService,
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

    generateKeypair: async (user, params?) => {
      return await this.gearService.createKeyPair(user);
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
      return await this.programService.getProgram(params.hash);
    },

    all: async (user, params?) => {
      return await this.programService.getAllPrograms(user);
    },
  };
}
