import { Injectable, Logger } from '@nestjs/common';
import { ApiPromise, ApiRx, Keyring, WsProvider } from '@polkadot/api';
import { stringToU8a } from '@polkadot/util';
import {
  mnemonicGenerate,
  randomAsHex,
  signatureVerify,
} from '@polkadot/util-crypto';
import { User } from 'src/users/entities/user.entity';
import { KeyringPair } from '@polkadot/keyring/types';
import { UsersService } from '../users/users.service';
import { ProgramsService } from 'src/programs/programs.service';

@Injectable()
export class GearNodeService {
  private provider: WsProvider;

  constructor(
    private readonly userService: UsersService,
    private readonly programService: ProgramsService,
  ) {
    this.provider = new WsProvider(process.env.WS_PROVIDER);
  }

  private logger = new Logger('GearNodeService');

  async getApiPromise() {
    const api = await ApiPromise.create({ provider: this.provider });
    return api;
  }

  async getApiRx() {
    return await ApiRx.create({ provider: this.provider }).toPromise();
  }

  getKeyring(uri: string, name: string) {
    const keyring = new Keyring({ type: 'sr25519' });
    const keyPair = keyring.addFromUri(uri, { name });
    return keyPair;
  }

  getKeyringByMnemonic(user: User, mnemonic: string) {
    const uri = `//${user.id}`;
    const keyPair = this.getKeyring(uri, `${user.name}`);
    return keyPair;
  }

  async createKeyPair(user: User) {
    const mnemonic = mnemonicGenerate();
    const suri = `//${user.id}`;
    const keyPair = this.getKeyring(suri, `${user.name}`);
    this.userService.addPublicKey(user, keyPair.address);
    return {
      mnemonic,
      name: keyPair.meta.name,
      public: keyPair.address,
    };
  }

  checkSign(keyPair: KeyringPair, message: string) {
    const signature = keyPair.sign(stringToU8a(message));
    if (signatureVerify(message, signature, keyPair.address).isValid) {
      return 'success';
    } else {
      return 'failed';
    }
  }

  async uploadProgram(user: User, data, cb) {
    if (!data.gasLimit) {
      cb({ error: 'Invalid transaction. No gas limit specified' });
      return null;
    } else if (!data.value) {
      cb({ error: 'Invalid transaction. No initial value specified' });
      return null;
    }

    const code = this.programService.parseWASM(data.file);
    const programData = {
      user: user,
      name: data.filename,
      hash: null,
      blockHash: null,
      uploadedAt: null,
    };

    const api = await this.getApiPromise();
    const keyring = this.getKeyringByMnemonic(user, data.mnemonic);
    const salt = data.salt || randomAsHex(20);
    let program = null;

    try {
      program = api.tx.gear.submitProgram(
        code,
        salt,
        data.init_payload || '',
        data.gasLimit,
        data.value,
      );
    } catch (error) {
      cb({
        error: 'Invalid transaction. Incorrect params',
        message: error.message,
      });
      return null;
    }

    try {
      await program.signAndSend(keyring, ({ events = [], status }) => {
        if (status.isInBlock) {
          programData.blockHash = status.asInBlock.toHex();
          programData.uploadedAt = new Date().toString();
        } else if (status.isFinalized) {
          programData.blockHash = status.asFinalized.toHex();
          this.programService.saveProgram(programData);
        }

        events.forEach(({ phase, event: { data, method, section } }) => {
          try {
            if (method === 'NewProgram') {
              programData.hash = data[0].toString();
              cb(undefined, {
                status: status.type,
                blockHash: programData.blockHash,
                programHash: programData.hash,
              });
            }
          } catch (error) {
            cb({ error: 'Invalid transaction.', message: error.message });
            return null;
          }
        });
      });
    } catch (error) {
      const errorCode = +error.message.split(':')[0];
      if (errorCode === 1010) {
        cb({
          error: 'Invalid transaction. Account balance too low',
          message: error.message,
        });
      } else {
        cb({
          error: 'Invalid transaction. Account balance too low',
          message: error.message,
        });
      }
      return null;
    }
  }

  async subscribeNewHeads(client) {
    const api = await this.getApiPromise();

    const unsub = await api.rpc.chain.subscribeNewHeads((header) => {
      client.emit('newBlock', {
        hash: header.hash.toHex(),
        number: header.number,
      });
    });
    return unsub;
  }

  async totalIssuance(client) {
    const api = await this.getApiPromise();
    const total = await api.query.balances.totalIssuance();
    client.emit('totalIssuance', {
      totalIssuance: total.toHuman(),
    });
  }

  async balanceTransfer(publicKey: string, value, cb?) {
    const api = await this.getApiPromise();
    try {
      const unsub = await api.tx.balances
        .transfer(publicKey, value)
        .signAndSend(this.getKeyring('//Alice', 'Alice default'), (result) => {
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
      cb({ error: error.message });
      return null;
    }
  }

  async getBalance(publicKey: string) {
    const api = await this.getApiPromise();
    const { data: balance } = await api.query.system.account(publicKey);
    return balance.free.toHuman();
  }
}
