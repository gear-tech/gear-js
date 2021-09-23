import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ProgramsService } from 'src/programs/programs.service';
import {
  GearNodeError,
  GettingMetadataError,
  InvalidParamsError,
  ProgramNotFound,
} from 'src/json-rpc/errors';
import { isJsonObject } from '@polkadot/util';
import { sendProgram } from './program.gear';
import { sendMessage } from './message.gear';
import { GearNodeEvents } from './events';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LogMessage } from 'src/messages/interface';
import { MessagesService } from 'src/messages/messages.service';
import { KeyringPair } from '@polkadot/keyring/types';
import { SendMessageData, UploadProgramData } from './interfaces';
import { RpcCallback } from 'src/json-rpc/interfaces';
import {
  CreateType,
  GearApi,
  GearKeyring,
  getWasmMetadata,
} from '@gear-js/api';
import { Metadata } from '@gear-js/api/types/src/interfaces/metadata';
import { Program } from 'src/programs/entities/program.entity';
import { UnsubscribePromise } from '@polkadot/api/types';

const logger = new Logger('GearNodeService');
@Injectable()
export class GearNodeService {
  private api: GearApi;
  private rootKeyring: KeyringPair;

  constructor(
    private readonly userService: UsersService,
    private readonly programService: ProgramsService,
    private readonly messageService: MessagesService,
    private readonly subscription: GearNodeEvents,
  ) {
    GearApi.create({ providerAddress: process.env.WS_PROVIDER }).then((api) => {
      this.api = api;
      this.updateWebsiteAccountBalance();
    });
  }

  async updateWebsiteAccountBalance() {
    const accountSeed = process.env.ACCOUNT_SEED;
    const sudoSeed = process.env.SUDO_SEED;
    const sudoKeyring = parseInt(process.env.DEBUG)
      ? GearKeyring.fromSuri('//Alice', 'Alice default')
      : await GearKeyring.fromSeed('websiteAccount', sudoSeed);
    if (!accountSeed) {
      const { keyring } = await GearKeyring.create('websiteAccount');
      this.rootKeyring = keyring;
    } else {
      this.rootKeyring = await GearKeyring.fromSeed(
        accountSeed,
        'websiteAccount',
      );
    }

    const currentBalance = await this.api.balance.findOut(
      this.rootKeyring.address,
    );
    if (currentBalance.toNumber() < +process.env.SITE_ACCOUNT_BALANCE) {
      this.balanceTransfer(
        {
          from: sudoKeyring,
          to: this.rootKeyring.address,
          value: +process.env.SITE_ACCOUNT_BALANCE - currentBalance.toNumber(),
        },
        (error, data) => {
          if (error) {
            logger.error(error);
          } else {
            logger.log(data);
          }
        },
      );
    }
  }

  async uploadProgram(
    user: User,
    data: UploadProgramData,
    callback: RpcCallback,
  ): Promise<void> {
    if (
      !data ||
      !data.gasLimit ||
      (!data.value && data.value !== 0) ||
      !data.file ||
      !data.filename ||
      !data.keyPairJson
    ) {
      throw new InvalidParamsError();
    }

    const binary = this.programService.parseWASM(data.file);
    const keyring = GearKeyring.fromJson(data.keyPairJson);

    const programData = {
      user: user,
      name: data.filename,
      hash: null,
      blockHash: null,
      uploadedAt: null,
      title: data.meta.title || null,
      meta: data.meta,
    };

    const initMessage: LogMessage = {
      id: null,
      destination: user,
      program: null,
      date: null,
      payload: data.initPayload.toString(),
    };
    let program: Program;

    try {
      await sendProgram(
        this.api,
        keyring,
        binary,
        data.initPayload,
        data.gasLimit,
        data.value,
        data.meta,
        async (action: string, callbackData?: any) => {
          switch (action) {
            case 'saveProgram':
              programData.hash = callbackData.programId;
              programData.uploadedAt = new Date();
              program = await this.programService.saveProgram(programData);
              initMessage.program = program;
              break;
            case 'saveMessage':
              initMessage.id = callbackData.initMessageId;
              initMessage.date = new Date();
              this.messageService.save(initMessage);
              program.blockHash = callbackData.blockHash;
              this.programService.updateProgram(program);
              break;
            default:
              callback(undefined, callbackData);
          }
        },
      );
    } catch (error) {
      this.programService.removeProgram(programData.hash);
      throw error;
    }
  }

  async sendMessage(
    user: User,
    data: SendMessageData,
    callback: RpcCallback,
  ): Promise<void> {
    if (
      !data ||
      !data.destination ||
      !data.payload ||
      !data.gasLimit ||
      !data.value ||
      !data.keyPairJson
    ) {
      throw new InvalidParamsError();
    }

    const keyring = GearKeyring.fromJson(data.keyPairJson);

    const program = await this.programService.findProgram(data.destination);
    if (!program) {
      callback(new ProgramNotFound(data.destination).toJson());
      return null;
    }

    let initMessage: LogMessage = {
      id: null,
      destination: user,
      program: program,
      date: null,
      payload: data.payload.toString(),
    };
    try {
      await sendMessage(
        this.api,
        keyring,
        program.hash,
        data.payload,
        data.gasLimit,
        data.value,
        JSON.parse(program.meta),
        async (action, callbackData) => {
          switch (action) {
            case 'save':
              initMessage.id = callbackData.messageId;
              initMessage.date = new Date();
              this.messageService.save(initMessage);
              callback(undefined, callbackData);
              break;
          }
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async totalIssuance(): Promise<string> {
    const total = await this.api.totalIssuance();
    return total;
  }

  async balanceTransfer(
    options: {
      from?: KeyringPair;
      to: string;
      value: number;
    },
    callback?: RpcCallback,
  ): Promise<void> {
    if (
      options.to !== this.rootKeyring.address &&
      (await this.api.balance.findOut(this.rootKeyring.address)).toNumber() <
        options.value
    ) {
      await this.updateWebsiteAccountBalance();
    }
    if (!options.from) {
      options.from = this.rootKeyring;
    }
    try {
      this.api.balance
        .transferBalance(options.from, options.to, 100_000_000, () => {})
        .then(() => {
          callback(undefined, 'Transfer balance succeed');
        });
    } catch (error) {
      throw new GearNodeError(error.message);
    }
  }

  async getBalance(publicKey: string): Promise<{ freeBalance: string }> {
    const balance = await this.api.balance.findOut(publicKey);
    return { freeBalance: balance.toHuman() };
  }

  async getGasSpent(hash: string, payload: string | JSON): Promise<number> {
    const program = await this.programService.findProgram(hash);
    if (!program) {
      return 0;
    }
    const meta = JSON.parse(program.meta);
    let gasSpent = await this.api.program.getGasSpent(
      CreateType.encode('H256', hash),
      payload,
      meta.input,
      meta,
    );
    return gasSpent.toNumber();
  }

  async getMeta(hash: string): Promise<Metadata> {
    const program = await this.programService.findProgram(hash);
    if (!program) {
      throw new ProgramNotFound(hash);
    }
    return JSON.parse(program.meta);
  }

  async saveEvents(): Promise<void> {
    this.subscription.events.subscribe({
      next: async (event) => {
        switch (event.type) {
          case 'log':
            const program = await this.programService.findProgram(
              event.program,
            );
            const meta = JSON.parse(program.meta);
            const response = CreateType.decode(
              meta.output,
              event.response,
              meta,
            ).toJSON();
            this.messageService.update({
              id: event.id,
              program: program,
              destination: await this.userService.findOneByPublicKey(
                event.destination,
              ),
              date: event.date,
              response: isJsonObject(response)
                ? JSON.stringify(response)
                : response,
              responseId: event.responseId.toHex(),
            });
            break;
          case 'program':
            this.programService.initStatus(event.hash, event.status);
            break;
        }
      },
    });
  }

  async subscribeEvents(
    user: User,
    callback: RpcCallback,
  ): Promise<Subscription> {
    const filtered = this.subscription.events.pipe(
      filter((event) => {
        return event.destination === user.publicKey;
      }),
    );
    const unsub = filtered.subscribe({
      next: async (event) => {
        switch (event.type) {
          case 'log':
            const program = await this.programService.findProgram(
              event.program,
            );
            const meta = JSON.parse(program.meta);
            const response = CreateType.decode(
              meta.output,
              event.response,
              meta,
            ).toJSON();
            callback(undefined, {
              event: 'Log',
              id: event.id,
              program: event.program,
              date: event.date,
              response: isJsonObject(response)
                ? JSON.stringify(response)
                : response,
            });
            break;
          case 'program':
            callback(undefined, {
              event: event.status,
              programName: event.programName,
              program: event.hash,
              date: event.date,
            });
            break;
        }
      },
    });
    return unsub;
  }

  subscribeNewHeads(callback: RpcCallback): UnsubscribePromise {
    try {
      const unsub = this.api.gearEvents.subscribeNewBlocks((head) => {
        callback(undefined, {
          hash: head.hash.toHex(),
          number: head.number.toString(),
        });
      });
      return unsub;
    } catch (error) {
      throw new GearNodeError(error.message);
    }
  }

  async addMetadata(
    user: User,
    data: { programId: string; file?: Buffer; types?: any },
    callback,
  ) {
    const program = await this.programService.findProgram(data.programId, user);
    if (!program) {
      callback(new ProgramNotFound(data.programId));
    }
    let meta: Metadata = {
      title: undefined,
      init_input: undefined,
      init_output: undefined,
      input: undefined,
      output: undefined,
    };
    if (data.file) {
      try {
        meta = await getWasmMetadata(data.file);
      } catch (error) {
        throw new GettingMetadataError();
      }
    } else {
      meta = data.types;
    }
    callback(undefined, await this.programService.addMeta(program, meta));
  }

  async getAllNoGUIPrograms() {
    let programs = await this.api.program.allUploadedPrograms();
    const filter = async (array, condition) => {
      const results = await Promise.all(array.map(condition));
      return array.filter((_v, index) => results[index]);
    };
    programs = await filter(
      programs,
      async (hash) => !(await this.programService.isInDB(hash)),
    );
    return programs;
  }
}
