/* eslint-disable @typescript-eslint/no-explicit-any */

import { GearApi, Program } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder, ActorId } from 'sails-js';

export class SailsProgram {
  public readonly registry: TypeRegistry;
  public readonly dns: Dns;
  // @ts-expect-error silence the error
  private _program: Program;

  constructor(
    public api: GearApi,
    programId?: `0x${string}`,
  ) {
    const types: Record<string, any> = {
      ContractInfo: { admins: 'Vec<[u8;32]>', program_id: '[u8;32]', registration_time: 'String' },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
    if (programId) {
      this._program = new Program(programId, api);
    }

    this.dns = new Dns(this);
  }

  public get programId(): `0x${string}` {
    if (!this._program) throw new Error(`Program ID is not set`);
    return this._program.id;
  }
}

export class Dns {
  constructor(private _program: SailsProgram) {}

  public addAdminToProgram(name: string, new_admin: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'AddAdminToProgram', name, new_admin],
      '(String, String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public addNewProgram(name: string, program_id: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'AddNewProgram', name, program_id],
      '(String, String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public changeProgramId(name: string, new_program_id: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'ChangeProgramId', name, new_program_id],
      '(String, String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public deleteProgram(name: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'DeleteProgram', name],
      '(String, String, String)',
      'Null',
      this._program.programId,
    );
  }

  public removeAdminFromProgram(name: string, admin_to_remove: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'RemoveAdminFromProgram', name, admin_to_remove],
      '(String, String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }
}
