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
  constructor(
    private readonly userService: UsersService,
    private readonly programService: ProgramsService,
  ) {}

  private logger = new Logger('GearNodeService');

  async getApiPromise() {
    const provider = new WsProvider(process.env.WS_PROVIDER);
    const api = await ApiPromise.create({ provider });
    return api;
  }

  async getApiRx() {
    const provider = new WsProvider(process.env.WS_PROVIDER);
    return await ApiRx.create({ provider }).toPromise();
  }

  getKeyring(uri: string, name: string) {
    const keyring = new Keyring({ type: 'sr25519' });
    const keyPair = keyring.addFromUri(uri, { name });
    return keyPair;
  }

  getKeyringByMnemonic(user: User, mnemonic: string) {
    const uri = `${mnemonic}//${user.id}`;
    const keyPair = this.getKeyring(uri, `${user.name}`);
    return keyPair;
  }

  async createKeyPair(user: User) {
    const mnemonic = mnemonicGenerate();
    const suri = `${mnemonic}//${user.id}`;
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

  async uploadProgram(client, data) {
    if (!data.gasLimit) {
      client.emit('submitProgram.failed', { detail: 'no gas limit specified' });
      return null;
    } else if (!data.value) {
      client.emit('submitProgram.failed', {
        detail: 'no initial value specified',
      });
      return null;
    }

    const code = this.programService.parseWASM(data.file);
    const programData = {
      user: client.user,
      name: data.filename,
      hash: null,
      blockHash: null,
      uploadedAt: null,
    };

    const api = await this.getApiPromise();
    const keyring = this.getKeyringByMnemonic(client.user, data.mnemonic);
    const salt = data.salt || randomAsHex(20);

    const program = api.tx.gear.submitProgram(
      code,
      salt,
      data.init_payload || '',
      data.gasLimit,
      data.value,
    );

    program.signAndSend(keyring, ({ events = [], status }) => {
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
            client.emit('submitProgram.success', {
              status: status.type,
              blockHash: programData.blockHash,
              programHash: programData.hash,
            });
          }
        } catch (error) {
          this.logger.error(error);
        }
      });
    });
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

  async balanceTransfer(publicKey: string, value) {
    const api = await this.getApiPromise();
    const unsub = await api.tx.balances
      .transfer(publicKey, value)
      .signAndSend(this.getKeyring('//Alice', 'Alice default'), (result) => {
        if (result.status.isInBlock) {
          this.logger.log(
            `Transaction included at blockHash ${result.status.asInBlock}`,
          );
        } else if (result.status.isFinalized) {
          this.logger.log(
            `Transaction finalized at blockHash ${result.status.asFinalized}`,
          );
          unsub();
        }
      });
  }
}
