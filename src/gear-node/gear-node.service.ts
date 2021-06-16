import { Injectable, Logger } from '@nestjs/common';
import { ApiPromise, ApiRx, Keyring, WsProvider } from '@polkadot/api';
import { stringToU8a } from '@polkadot/util';
import { mnemonicGenerate, signatureVerify } from '@polkadot/util-crypto';
import { User } from 'src/users/entities/user.entity';
import { KeyringPair } from '@polkadot/keyring/types';
import { UsersService } from '../users/users.service';

@Injectable()
export class GearNodeService {
  constructor(private readonly userService: UsersService) {}

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

  createKeyPair(user: User) {
    const mnemonic = mnemonicGenerate();
    const uri = `${mnemonic}//${user.id}`;
    const keyPair = this.getKeyring(uri, `${user.name}`);
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

  async submitProgram(
    client,
    keyring: KeyringPair,
    code: Uint8Array,
    salt: string,
    init_payload: string,
    gasLimit: number,
    value: number,
  ) {
    const api = await this.getApiPromise();
    const program = api.tx.gear.submitProgram(
      code,
      salt,
      init_payload,
      gasLimit,
      value,
    );

    const programData = {
      blockHash: '',
      programHash: '',
      status: '',
    };
    program.signAndSend(keyring, ({ events = [], status }) => {
      if (status.isInBlock) {
        programData.blockHash = status.asInBlock.toHex();
        programData.status = 'inBlock';
      } else if (status.isFinalized) {
        programData.blockHash = status.asFinalized.toHex();
        programData.status = 'finalized';
      }

      events.forEach(({ phase, event: { data, method, section } }) => {
        try {
          if (method === 'NewProgram') {
            programData.programHash = data.toString();
            client.emit('submitProgram.success', programData);
          }
        } catch (error) {
          this.logger.error(error);
        }
      });
    });
  }

  async subscribeNewHeads(client) {
    const api = await this.getApiPromise();

    api.rpc.chain.subscribeNewHeads((header) => {
      client.emit('newBlock', {
        hash: header.hash.toHex(),
        number: header.number,
      });
    });
  }

  async totalIssuance(client) {
    const api = await this.getApiPromise();
    const total = await api.query.balances.totalIssuance();
    client.emit('totalIssuance', {
      totalIssuance: total.toHuman(),
    });
  }
}
