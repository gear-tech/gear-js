import { GearApi } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder } from 'sails-js';

export type ActorId = `0x${string}`;

export interface ContractInfo {
  admin: ActorId;
  program_id: ActorId;
  registration_time: string;
}

export class Program {
  public readonly registry: TypeRegistry;
  public readonly dns: Dns;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types = {
      ActorId: '([u8; 32])',
      ContractInfo: { admin: 'ActorId', program_id: 'ActorId', registration_time: 'String' },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.dns = new Dns(this);
  }
}

export class Dns {
  constructor(private _program: Program) {}

  public addNewProgram(name: string, program_id: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'AddNewProgram', name, program_id],
      '(String, String, String, ActorId)',
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
      '(String, String, String, ActorId)',
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

  public addAdminToProgram(name: string, new_admin: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'AddAdminToProgram', name, new_admin],
      '(String, String, String, ActorId)',
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
      '(String, String, String, ActorId)',
      'Null',
      this._program.programId,
    );
  }
}
