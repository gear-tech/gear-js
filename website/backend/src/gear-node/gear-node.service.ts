import { Injectable, Logger } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { randomAsHex } from '@polkadot/util-crypto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ProgramsService } from 'src/programs/programs.service';
import { createKeyring, keyringFromJson, keyringFromSeed } from './keyring';
import {
  GearNodeError,
  GettingMetadataError,
  InternalServerError,
  InvalidParamsError,
  ProgramNotFound,
} from 'src/json-rpc/errors';
import { isJsonObject, u8aToHex } from '@polkadot/util';
import { submitProgram } from './program.gear';
import { sendMessage } from './message.gear';
import definitions from 'src/interfaces/definitions';
import { GearNodeEvents } from './events';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { getWasmMetadata } from './wasm.meta';
import { LogMessage } from 'src/messages/interface';
import { MessagesService } from 'src/messages/messages.service';
import { CreateType } from 'src/gear-node/custom-types';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { SendMessageData, UploadProgramData } from './interfaces';
import { Bytes } from '@polkadot/types';
import { RpcCallback } from 'src/json-rpc/interfaces';

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
    private readonly createType: CreateType,
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
    const sudoKeyring = keyringFromSeed('websiteAccount', sudoSeed);
    if (!accountSeed) {
      const { keyring } = createKeyring('websiteAccount');
      this.keyring = keyring;
    } else {
      this.keyring = keyringFromSeed('websiteAccount', accountSeed);
    }

    const currentBalance = await this.getBalance(this.keyring.address);
    this.balanceTransfer({
      from: sudoKeyring,
      to: this.keyring.address,
      value: 999999999999999 - currentBalance.freeBalance,
      cb: (error, data) => {
        if (error) {
          logger.error(error);
        } else {
          logger.log(data);
        }
      },
    });
  }

  createKeyPair(user: User): KeyringPair$Json {
    if (user.seed) {
      const keyring = keyringFromSeed(user.username, user.seed);
      if (u8aToHex(keyring.publicKey) !== user.publicKey) {
        this.userService.addPublicKey(user, u8aToHex(keyring.publicKey));
      }
      return keyring.toJson();
    }
    const { publicKey, seed, json } = createKeyring(user.username);
    this.userService.addPublicKey(user, publicKey);
    this.userService.addSeed(user, seed);
    return json;
  }

  async uploadProgram(
    user: User,
    data: UploadProgramData,
    cb: RpcCallback,
  ): Promise<void> {
    if (
      !data ||
      !data.gasLimit ||
      (!data.value && data.value !== 0) ||
      !data.file ||
      !data.filename
    ) {
      throw new InvalidParamsError();
    }

    const binary = this.programService.parseWASM(data.file);
    let code = null;
    try {
      code = this.createType.toBytes('bytes', Array.from(binary));
    } catch (error) {
      logger.error(error.message);
      throw new InvalidParamsError("Can't encode program to bytes");
    }

    const keyring = data.keyPairJson
      ? keyringFromJson(data.keyPairJson)
      : keyringFromSeed(user.username, user.seed);
    if (keyring.isLocked) {
      keyring.unlock();
    }
    const salt = data.salt || randomAsHex(20);
    let meta = {
      title: undefined,
      init_input: undefined,
      init_output: undefined,
      input: undefined,
      output: undefined,
    };
    if (data.meta) {
      try {
        meta = await getWasmMetadata(data.meta);
        Object.keys(meta).forEach((elem) => {
          meta[elem] = JSON.stringify(meta[elem]);
        });
      } catch (error) {
        throw new GettingMetadataError();
      }
    }
    const programData = {
      user: user,
      name: data.filename,
      hash: null,
      blockHash: null,
      uploadedAt: null,
      title: meta.title || null,
      initType: meta.init_input || data.initType || null,
      initOutType: meta.init_output || data.initOutType || null,
      incomingType: meta.input || data.incomingType || null,
      expectedType: meta.output || data.expectedType || null,
    };

    let payload: Bytes;
    try {
      payload = this.createType.toBytes(programData.initType, data.initPayload);
    } catch (error) {
      logger.error(error);
      if (error.toJson) throw error;
      else throw new InternalServerError();
    }
    let initMessage: LogMessage = {
      id: null,
      destination: user,
      program: null,
      date: null,
      payload: data.initPayload.toString(),
    };
    try {
      await submitProgram(
        this.api,
        keyring,
        code,
        salt,
        payload,
        data.gasLimit,
        data.value,
        programData,
        initMessage,
        async (action: string, data?: any) => {
          switch (action) {
            case 'save':
              const program = await this.programService.saveProgram(
                programData,
              );
              initMessage.program = program;
              initMessage.date = new Date();
              this.messageService.save(initMessage);
              break;
            case 'gear':
              cb(undefined, data);
              break;
            case 'remove':
              this.programService.removeProgram(programData.hash);
              break;
          }
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(
    user: User,
    messageData: SendMessageData,
    cb: RpcCallback,
  ): Promise<void> {
    if (
      !messageData ||
      !messageData.destination ||
      !messageData.payload ||
      !messageData.gasLimit ||
      !messageData.value
    ) {
      throw new InvalidParamsError();
    }

    const keyring = messageData.keyPairJson
      ? keyringFromJson(messageData.keyPairJson)
      : keyringFromSeed(user.username, user.seed);
    if (keyring.isLocked) {
      keyring.unlock();
    }

    const program = await this.programService.findProgram(
      messageData.destination,
    );
    if (!program) {
      cb(new ProgramNotFound(messageData.destination).toJson());
      return null;
    }

    let payload: Bytes;
    try {
      payload = await this.createType.toBytes(
        program.incomingType || 'utf8',
        messageData.payload,
      );
    } catch (error) {
      if (error.toJson) throw error;
      else throw new InternalServerError();
    }
    let initMessage: LogMessage = {
      id: null,
      destination: user,
      program: program,
      date: null,
      payload: messageData.payload.toString(),
    };
    try {
      await sendMessage(
        this.api,
        keyring,
        program.hash,
        payload,
        messageData.gasLimit,
        messageData.value,
        initMessage,
        async (action, data) => {
          switch (action) {
            case 'save':
              this.messageService.save(initMessage);
              break;
            case 'gear':
              cb(undefined, data);
              break;
          }
        },
      );
    } catch (error) {
      cb(error.toJson());
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
    const bytes = this.createType.toBytes(program.incomingType, payload);
    let gasSpent = await this.api.rpc.gear.getGasSpent(hash, bytes.toHex());
    return gasSpent.toNumber();
  }

  async getPayloadType(hash: string): Promise<string> {
    const program = await this.programService.findProgram(hash);
    if (!program) {
      throw new ProgramNotFound(hash);
    }
    return program.incomingType;
  }

  async saveEvents(): Promise<void> {
    this.subscription.events.subscribe({
      next: async (event) => {
        switch (event.type) {
          case 'log':
            const program = await this.programService.findProgram(
              event.program,
            );
            const response = this.createType
              .fromBytes(program.expectedType, event.response)
              .toJSON();
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
            const response = this.createType
              .fromBytes(program.expectedType, event.response)
              .toJSON();
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

  async addMetadata(user, data, callback) {
    let meta = {
      title: undefined,
      init_input: undefined,
      init_output: undefined,
      input: undefined,
      output: undefined,
    };
    if (data.meta) {
      try {
        meta = await getWasmMetadata(data.meta);
        Object.keys(meta).forEach((elem) => {
          meta[elem] = JSON.stringify(meta[elem]);
        });
      } catch (error) {
        throw new GettingMetadataError();
      }
    }
    const programData = {
      user: user,
      name: data.name,
      hash: data.hash,
      blockHash: null,
      uploadedAt: new Date(),
      title: meta.title || null,
      initType: meta.init_input || data.initType || null,
      initOutType: meta.init_output || data.initOutType || null,
      incomingType: meta.input || data.incomingType || null,
      expectedType: meta.output || data.expectedType || null,
    };

    callback(undefined, await this.programService.saveProgram(programData));
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
