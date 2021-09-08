import { GearApi, CreateType } from '.';
import { Program } from './interfaces';
import { SubmitProgramError, TransactionError } from './errors';
import { ApiPromise } from '@polkadot/api';
import { Bytes } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { KeyringPair } from '@polkadot/keyring/types';
import { randomAsHex, blake2AsU8a } from '@polkadot/util-crypto';
import { Metadata } from './interfaces/metadata';

export class GearProgram {
  private api: ApiPromise;
  private createType: CreateType;
  program: any;

  constructor(gearApi: GearApi) {
    this.api = gearApi.api;
    this.createType = new CreateType(gearApi);
  }

  /**
   *
   * @returns ProgramId
   */
  async submit(program: Program, meta: Metadata): Promise<string> {
    if (program.initPayload) {
      program.initPayload = this.createType.encode(meta.init_input, program.initPayload, meta);
    } else {
      program.initPayload = '0x00';
    }
    const salt = program.salt || randomAsHex(20);
    const code = this.createType.encode('bytes', Array.from(program.code));
    try {
      this.program = this.api.tx.gear.submitProgram(
        code,
        salt,
        program.initPayload,
        program.gasLimit,
        program.value || 0
      );
      const programId = this.generateProgramId(code, salt);
      return programId.toHex();
    } catch (error) {
      throw new SubmitProgramError();
    }
  }

  signAndSend(keyring: KeyringPair, callback: (data: any) => void) {
    return new Promise(async (resolve, reject) => {
      let blockHash: string;
      try {
        await this.program.signAndSend(keyring, ({ events = [], status }) => {
          if (status.isInBlock) {
            blockHash = status.asInBlock.toHex();
            resolve(0);
          }

          // Check transaction errors
          events
            .filter(({ event }) => this.api.events.system.ExtrinsicFailed.is(event))
            .forEach(
              ({
                event: {
                  data: [error]
                }
              }) => {
                reject(new TransactionError(`${error.toString()}`));
              }
            );

          events
            .filter(({ event }) => this.api.events.gear.InitMessageEnqueued.is(event))
            .forEach(async ({ event: { data, method } }) => {
              callback({
                method,
                status: status.type,
                blockHash: blockHash,
                programId: data[0].program_id.toHex(),
                initMessageId: data[0].message_id.toHex()
              });
            });
        });
      } catch (error) {
        const errorCode = +error.message.split(':')[0];
        if (errorCode === 1010) {
          reject(new TransactionError('Account balance too low'));
        } else {
          reject(new TransactionError(error.message));
        }
      }
    });
  }

  async allUploadedPrograms(): Promise<string[]> {
    let programs = (await this.api.rpc.state.getKeys('g::prog::')).map((prog) => {
      return `0x${prog.toHex().slice(Buffer.from('g::prog::').toString('hex').length + 2)}`;
    });
    return programs;
  }

  async getGasSpent(programId: H256, payload: any, type: any, meta: Metadata): Promise<number> {
    const payloadBytes = this.createType.encode(type, payload, meta);
    const gasSpent = await this.api.rpc.gear.getGasSpent(programId, payloadBytes);
    return gasSpent.toNumber();
  }

  generateProgramId(code: Bytes, salt: string): H256 {
    const codeArr = this.api.createType('Vec<u8>', code).toU8a();
    const saltArr = this.api.createType('Vec<u8>', salt).toU8a();

    const id = new Uint8Array(codeArr.length + saltArr.length);
    id.set(codeArr);
    id.set(saltArr, codeArr.length);

    return this.api.createType('H256', blake2AsU8a(id, 256));
  }
}
