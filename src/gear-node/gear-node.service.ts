import { Injectable, Logger } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { randomAsHex } from '@polkadot/util-crypto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ProgramsService } from 'src/programs/programs.service';
import {
  createKeyring,
  keyringFromJson,
  keyringFromSeed,
  keyringFromSuri,
} from './keyring';
import {
  GearNodeError,
  InvalidParamsError,
  ProgramNotFound,
} from 'src/json-rpc/errors';
import { u8aToHex } from '@polkadot/util';
import { submitProgram } from './program.gear';
import { sendMessage } from './message.gear';
import definitions from 'sample-polkadotjs-typegen/interfaces/definitions';
import { toBytes } from './utils';
import { subscribetEvents } from './events';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventsService } from 'sample-polkadotjs-typegen/events/events.service';
@Injectable()
export class GearNodeService {
  private provider: WsProvider;
  private api: ApiPromise;
  private blocksSubject: Subject<any>;
  private eventsSubject: Subject<any>;
  private userEventSubject: Subject<any>;

  constructor(
    private readonly userService: UsersService,
    private readonly programService: ProgramsService,
    private readonly eventService: EventsService,
  ) {
    this.provider = new WsProvider(process.env.WS_PROVIDER);
    this.createApiPromise().then((api: ApiPromise) => {
      subscribetEvents(api, ({ events, blocks }) => {
        this.blocksSubject = blocks;
        this.eventsSubject = events;
        this.saveEvents();
      });
      this.userEventSubject = this.eventService.eventSubject;
    });
  }

  private async createApiPromise() {
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
      });
      resolve(this.api);
    });
  }

  createKeyPair(user: User) {
    if (user.seed) {
      const keyring = keyringFromSeed(user, user.seed);
      if (u8aToHex(keyring.publicKey) !== user.publicKey) {
        this.userService.addPublicKey(user, u8aToHex(keyring.publicKey));
      }
      return keyring.toJson();
    }
    const { publicKey, seed, json } = createKeyring(user);
    this.userService.addPublicKey(user, publicKey);
    this.userService.addSeed(user, seed);
    return json;
  }

  async uploadProgram(user: User, data, cb) {
    if (
      !data ||
      !data.gasLimit ||
      !data.value ||
      !data.file ||
      !data.filename
    ) {
      throw new InvalidParamsError();
    }

    const binary = this.programService.parseWASM(data.file);
    const code = toBytes(this.api, 'bytes', Array.from(binary));

    const keyring = data.keyPairJson
      ? keyringFromJson(data.keyPairJson)
      : keyringFromSeed(user, user.seed);
    if (keyring.isLocked) {
      keyring.unlock();
    }
    const salt = data.salt || randomAsHex(20);

    const programData = {
      user: user,
      name: data.filename,
      hash: null,
      blockHash: null,
      uploadedAt: null,
      initType: data.initType || null,
      expectedType: data.expectedType || null,
      incomingType: data.incomingType || null,
    };

    const payload = toBytes(this.api, data.initType, data.initPayload);

    try {
      await submitProgram(
        this.api,
        keyring,
        code,
        salt,
        payload || '0x00',
        data.gasLimit,
        data.value,
        programData,
        (action, data?) => {
          if (action === 'save') {
            this.programService.saveProgram(programData);
          } else if (action === 'gear') {
            cb(undefined, data);
          } else if (action === 'remove') {
            this.programService.removeProgram(programData.hash);
          }
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(user: User, messageData, cb) {
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
      : keyringFromSeed(user, user.seed);
    if (keyring.isLocked) {
      keyring.unlock();
    }

    const program = await this.programService.getProgram(
      messageData.destination,
    );
    if (!program) {
      cb(new ProgramNotFound(messageData.destination).toJson());
      return null;
    }

    let payload = messageData.payload;
    if (program.incomingType) {
      payload = toBytes(this.api, program.incomingType, messageData.payload);
    } else {
      payload = messageData.payload;
    }

    await sendMessage(
      this.api,
      keyring,
      program.hash,
      payload,
      messageData.gasLimit,
      messageData.value,
      (action, data) => {
        if (action === 'error') {
          cb(data);
        } else if (action === 'gear') {
          cb(undefined, data);
        }
      },
    );
  }

  async totalIssuance() {
    const total = await (
      await this.api.query.balances.totalIssuance()
    ).toHuman();
    return total;
  }

  async balanceTransfer(publicKey: string, value, cb?) {
    try {
      const unsub = await this.api.tx.balances
        .transfer(publicKey, value)
        .signAndSend(keyringFromSuri('//Alice', 'Alice default'), (result) => {
          if (result.status.isFinalized) {
            if (cb) {
              cb(undefined, {
                message: `Transfer balance succeed`,
              });
            }
            unsub();
          }
        });
    } catch (error) {
      throw new GearNodeError(error.message);
    }
  }

  async getBalance(publicKey: string) {
    const { data: balance } = await this.api.query.system.account(publicKey);
    return { freeBalance: balance.free.toHuman() };
  }

  async saveEvents() {
    this.eventsSubject.subscribe({
      next: (event) => {
        switch (event.type) {
          case 'log':
            this.eventService.log({ ...event });
            break;
          case 'program':
            this.eventService.program({ ...event });
            break;
        }
      },
    });
  }

  async subscribeEvents(user: User, callback) {
    const filtered = this.userEventSubject.pipe(
      filter((event) => {
        return event.dest === user.publicKey;
      }),
    );
    const unsub = filtered.subscribe({
      next: (event) => {
        callback(undefined, event);
      },
    });
    return unsub;
  }

  async subscribeNewHeads(cb) {
    try {
      const unsub = this.blocksSubject.subscribe({
        next: (head) => {
          cb(undefined, {
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
}
