import { Injectable, Logger } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ProgramsService } from 'src/programs/programs.service';
import {
  GearNodeError,
  GettingMetadataError,
  InternalServerError,
  InvalidParamsError,
  ProgramNotFound,
} from 'src/json-rpc/errors';
import { isJsonObject } from '@polkadot/util';
import { sendProgram } from './program.gear';
import { sendMessage } from './message.gear';
import definitions from 'src/interfaces/definitions';
import { GearNodeEvents } from './events';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LogMessage } from 'src/messages/interface';
import { MessagesService } from 'src/messages/messages.service';
import { KeyringPair } from '@polkadot/keyring/types';
import { SendMessageData, UploadProgramData } from './interfaces';
import { RpcCallback } from 'src/json-rpc/interfaces';
import { CreateType, GearKeyring, getWasmMetadata } from '@gear-js/api';
import { Metadata } from '@gear-js/api/types/src/interfaces/metadata';
import { callback } from 'telegraf/typings/button';
import { Program } from 'src/programs/entities/program.entity';

const logger = new Logger('GearNodeService');
@Injectable()
export class GearNodeService {
  private provider: WsProvider;
  private api: ApiPromise;
  private keyring: KeyringPair;

  constructor(
    private readonly userService: UsersService,
    private readonly programService: ProgramsService,
    private readonly messageService: MessagesService,
    private readonly subscription: GearNodeEvents,
  ) {
    this.provider = new WsProvider(process.env.WS_PROVIDER);
    this.createApiPromise().then((api: ApiPromise) => {
      this.subscription.subscribeBlocks(api);
      this.subscription.subscribeEvents(api);
      this.saveEvents();
      this.updateWebsiteAccountBalance();
    });
  }

  private createApiPromise(): Promise<ApiPromise> {
    return new Promise(async (resolve, reject) => {
      const types = Object.values(definitions).reduce(
        (res, types): object => ({ ...res, ...types }),
        {},
      );
      this.api = await ApiPromise.create({
        provider: this.provider,
        types: {
          ...types,
        },
        rpc: {
          gear: {
            getGasSpent: {
              description: 'Get GasSpent',
              params: [
                {
                  name: 'id',
                  type: 'H256',
                },
                {
                  name: 'payload',
                  type: 'Bytes',
                },
              ],
              type: 'u64',
            },
          },
        },
      });
      resolve(this.api);
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
      this.keyring = keyring;
    } else {
      this.keyring = await GearKeyring.fromSeed(accountSeed, 'websiteAccount');
    }

    const currentBalance = await this.getBalance(this.keyring.address);
    this.balanceTransfer({
      from: sudoKeyring,
      to: this.keyring.address,
      value: 999_999_999_999 - currentBalance.freeBalance,
      cb: (error, data) => {
        if (error) {
          logger.error(error);
        } else {
          logger.log(data);
        }
      },
    });
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
        async (action: string, data?: any) => {
          switch (action) {
            case 'saveProgram':
              programData.hash = data.programId;
              program = await this.programService.saveProgram(programData);
              initMessage.program = program;
              break;
            case 'saveMessage':
              initMessage.id = data.initMessageId;
              initMessage.date = new Date();
              this.messageService.save(initMessage);
              program.blockHash = data.blockHas;
              program.uploadedAt = new Date();
              this.programService.updateProgram(program);
              callback(undefined, data);
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
        program.meta,
        async (action, data) => {
          switch (action) {
            case 'save':
              initMessage.id = data.messageId;
              this.messageService.save(initMessage);
              callback(undefined, data);
              break;
          }
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async totalIssuance(): Promise<string> {
    const total = (await this.api.query.balances.totalIssuance()).toHuman();
    return total;
  }

  async balanceTransfer(options: {
    from?: KeyringPair;
    to: string;
    value: number;
    cb?: RpcCallback;
  }): Promise<void> {
    if (
      options.to !== this.keyring.address &&
      (await this.getBalance(this.keyring.address)).freeBalance <= options.value
    ) {
      await this.updateWebsiteAccountBalance();
    }

    return new Promise(async (resolve, reject) => {
      try {
        const unsub = await this.api.tx.balances
          .transfer(options.to, options.value)
          .signAndSend(options.from ? options.from : this.keyring, (result) => {
            if (result.status.isFinalized) {
              if (options.cb) {
                options.cb(undefined, {
                  message: `Transfer balance succeed`,
                });
              }
              unsub();
              resolve();
            }
          });
      } catch (error) {
        reject(new GearNodeError(error.message));
      }
    });
  }

  async getBalance(publicKey: string): Promise<{ freeBalance: number }> {
    const { data: balance } = await this.api.query.system.account(publicKey);
    return { freeBalance: balance.free.toNumber() };
  }

  async getGasSpent(hash: string, payload: string | JSON): Promise<number> {
    const program = await this.programService.findProgram(hash);
    if (!program) {
      return 0;
    }
    const bytes = CreateType.encode(program.meta.input, payload, program.meta);
    let gasSpent = await this.api.rpc.gear.getGasSpent(hash, bytes.toHex());
    return gasSpent.toNumber();
  }

  async getMeta(hash: string): Promise<Metadata> {
    const program = await this.programService.findProgram(hash);
    if (!program) {
      throw new ProgramNotFound(hash);
    }
    return program.meta;
  }

  async saveEvents(): Promise<void> {
    this.subscription.events.subscribe({
      next: async (event) => {
        switch (event.type) {
          case 'log':
            const program = await this.programService.findProgram(
              event.program,
            );
            const response = CreateType.decode(
              program.meta.output,
              event.response,
              program.meta,
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
            const response = CreateType.decode(
              program.meta.output,
              event.response,
              program.meta,
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

  subscribeNewHeads(callback: RpcCallback): Subscription {
    try {
      const unsub = this.subscription.blocks.subscribe({
        next: (head) => {
          callback(undefined, {
            hash: head.hash.toHex(),
            number: head.number.toString(),
          });
        },
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
    let programs = (await this.api.rpc.state.getKeys('g::prog::')).map(
      (prog) => {
        return `0x${prog
          .toHex()
          .slice(Buffer.from('g::prog::').toString('hex').length + 2)}`;
      },
    );
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
