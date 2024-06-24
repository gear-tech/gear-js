/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder, getServiceNamePrefix, getFnNamePrefix, ZERO_ADDRESS } from 'sails-js';

export type ActorId = [Array<number>];

export type Role = 'admin' | 'burner' | 'minter';

export class Program {
  public readonly registry: TypeRegistry;
  public readonly admin: Admin;
  public readonly erc20: Erc20;
  public readonly pausable: Pausable;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      ActorId: '([u8; 32])',
      Role: { _enum: ['Admin', 'Burner', 'Minter'] },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.admin = new Admin(this);
    this.erc20 = new Erc20(this);
    this.pausable = new Pausable(this);
  }

  newCtorFromCode(code: Uint8Array | Buffer, name: string, symbol: string, decimals: number): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      ['New', name, symbol, decimals],
      '(String, String, String, u8)',
      'String',
      code,
    );

    this.programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`, name: string, symbol: string, decimals: number) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      ['New', name, symbol, decimals],
      '(String, String, String, u8)',
      'String',
      codeId,
    );

    this.programId = builder.programId;
    return builder;
  }
}

export class Admin {
  constructor(private _program: Program) {}

  public allowancesReserve(additional: number): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Admin', 'AllowancesReserve', additional],
      '(String, String, u32)',
      'Null',
      this._program.programId,
    );
  }

  public balancesReserve(additional: number): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Admin', 'BalancesReserve', additional],
      '(String, String, u32)',
      'Null',
      this._program.programId,
    );
  }

  public batchMint(to: Array<ActorId>, values: Array<number | string>): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Admin', 'BatchMint', to, values],
      '(String, String, Vec<ActorId>, Vec<U256>)',
      'bool',
      this._program.programId,
    );
  }

  public burn(from: string, value: number | string): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Admin', 'Burn', from, value],
      '(String, String, [u8;32], U256)',
      'bool',
      this._program.programId,
    );
  }

  public grantRole(to: string, role: Role): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Admin', 'GrantRole', to, role],
      '(String, String, [u8;32], Role)',
      'bool',
      this._program.programId,
    );
  }

  public kill(inheritor: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Admin', 'Kill', inheritor],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public mint(to: string, value: number | string): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Admin', 'Mint', to, value],
      '(String, String, [u8;32], U256)',
      'bool',
      this._program.programId,
    );
  }

  public removeRole(from: string, role: Role): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Admin', 'RemoveRole', from, role],
      '(String, String, [u8;32], Role)',
      'bool',
      this._program.programId,
    );
  }

  public async allowances(
    skip: number,
    take: number,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<[[string, string], number | string]>> {
    const payload = this._program.registry
      .createType('(String, String, u32, u32)', ['Admin', 'Allowances', skip, take])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType(
      '(String, String, Vec<(([u8;32], [u8;32]), U256)>)',
      reply.payload,
    );
    return result[2].toJSON() as unknown as Array<[[string, string], number | string]>;
  }

  public async balances(
    skip: number,
    take: number,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<[string, number | string]>> {
    const payload = this._program.registry
      .createType('(String, String, u32, u32)', ['Admin', 'Balances', skip, take])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, Vec<([u8;32], U256)>)', reply.payload);
    return result[2].toJSON() as unknown as Array<[string, number | string]>;
  }

  public async hasRole(
    actor: string,
    role: string,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<boolean> {
    const payload = this._program.registry
      .createType('(String, String, [u8;32], String)', ['Admin', 'HasRole', actor, role])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, bool)', reply.payload);
    return result[2].toJSON() as unknown as boolean;
  }

  public async mapsData(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<[[number, number], [number, number]]> {
    const payload = this._program.registry.createType('(String, String)', '[Admin, MapsData]').toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, ((u32, u32), (u32, u32)))', reply.payload);
    return result[2].toJSON() as unknown as [[number, number], [number, number]];
  }

  public async roles(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<string>> {
    const payload = this._program.registry.createType('(String, String)', '[Admin, Roles]').toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, Vec<String>)', reply.payload);
    return result[2].toJSON() as unknown as Array<string>;
  }

  public subscribeToMintedEvent(
    callback: (data: { to: string; value: number | string }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Admin' && getFnNamePrefix(payload) === 'Minted') {
        callback(
          this._program.registry
            .createType('(String, String, {"to":"[u8;32]","value":"U256"})', message.payload)[2]
            .toJSON() as { to: string; value: number | string },
        );
      }
    });
  }

  public subscribeToBurnedEvent(
    callback: (data: { from: string; value: number | string }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Admin' && getFnNamePrefix(payload) === 'Burned') {
        callback(
          this._program.registry
            .createType('(String, String, {"from":"[u8;32]","value":"U256"})', message.payload)[2]
            .toJSON() as { from: string; value: number | string },
        );
      }
    });
  }

  public subscribeToKilledEvent(callback: (data: { inheritor: string }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Admin' && getFnNamePrefix(payload) === 'Killed') {
        callback(
          this._program.registry
            .createType('(String, String, {"inheritor":"[u8;32]"})', message.payload)[2]
            .toJSON() as { inheritor: string },
        );
      }
    });
  }

  public subscribeToBatchMintedEvent(
    callback: (data: { to: Array<ActorId>; values: Array<number | string> }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Admin' && getFnNamePrefix(payload) === 'BatchMinted') {
        callback(
          this._program.registry
            .createType('(String, String, {"to":"Vec<ActorId>","values":"Vec<U256>"})', message.payload)[2]
            .toJSON() as { to: Array<ActorId>; values: Array<number | string> },
        );
      }
    });
  }
}

export class Erc20 {
  constructor(private _program: Program) {}

  public approve(spender: string, value: number | string): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Erc20', 'Approve', spender, value],
      '(String, String, [u8;32], U256)',
      'bool',
      this._program.programId,
    );
  }

  public transfer(to: string, value: number | string): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Erc20', 'Transfer', to, value],
      '(String, String, [u8;32], U256)',
      'bool',
      this._program.programId,
    );
  }

  public transferFrom(from: string, to: string, value: number | string): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Erc20', 'TransferFrom', from, to, value],
      '(String, String, [u8;32], [u8;32], U256)',
      'bool',
      this._program.programId,
    );
  }

  public async allowance(
    owner: string,
    spender: string,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<bigint> {
    const payload = this._program.registry
      .createType('(String, String, [u8;32], [u8;32])', ['Erc20', 'Allowance', owner, spender])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, U256)', reply.payload);
    return result[2].toBigInt() as unknown as bigint;
  }

  public async balanceOf(
    owner: string,
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<bigint> {
    const payload = this._program.registry
      .createType('(String, String, [u8;32])', ['Erc20', 'BalanceOf', owner])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, U256)', reply.payload);
    return result[2].toBigInt() as unknown as bigint;
  }

  public async decimals(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<number> {
    const payload = this._program.registry.createType('(String, String)', ['Erc20', 'Decimals']).toHex();
    console.log('payload: ', payload);

    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    console.log('reply: ', reply.payload.toHex());

    const result = this._program.registry.createType('(String, String, u8)', reply.payload);
    return result[2].toNumber() as unknown as number;
  }

  public async name(originAddress: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<string> {
    const payload = this._program.registry.createType('(String, String)', '[Erc20, Name]').toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, String)', reply.payload);
    return result[2].toString() as unknown as string;
  }

  public async symbol(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<string> {
    const payload = this._program.registry.createType('(String, String)', '[Erc20, Symbol]').toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, String)', reply.payload);
    return result[2].toString() as unknown as string;
  }

  public async totalSupply(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<bigint> {
    const payload = this._program.registry.createType('(String, String)', '[Erc20, TotalSupply]').toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, U256)', reply.payload);
    return result[2].toBigInt() as unknown as bigint;
  }

  public subscribeToApprovalEvent(
    callback: (data: { owner: string; spender: string; value: number | string }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Erc20' && getFnNamePrefix(payload) === 'Approval') {
        callback(
          this._program.registry
            .createType('(String, String, {"owner":"[u8;32]","spender":"[u8;32]","value":"U256"})', message.payload)[2]
            .toJSON() as { owner: string; spender: string; value: number | string },
        );
      }
    });
  }

  public subscribeToTransferEvent(
    callback: (data: { from: string; to: string; value: number | string }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Erc20' && getFnNamePrefix(payload) === 'Transfer') {
        callback(
          this._program.registry
            .createType('(String, String, {"from":"[u8;32]","to":"[u8;32]","value":"U256"})', message.payload)[2]
            .toJSON() as { from: string; to: string; value: number | string },
        );
      }
    });
  }
}

export class Pausable {
  constructor(private _program: Program) {}

  public delegateAdmin(actor: string): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pausable', 'DelegateAdmin', actor],
      '(String, String, [u8;32])',
      'bool',
      this._program.programId,
    );
  }

  public pause(): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pausable', 'Pause'],
      '(String, String)',
      'bool',
      this._program.programId,
    );
  }

  public unpause(): TransactionBuilder<boolean> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<boolean>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pausable', 'Unpause'],
      '(String, String)',
      'bool',
      this._program.programId,
    );
  }

  public async isPaused(
    originAddress: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<boolean> {
    const payload = this._program.registry.createType('(String, String)', '[Pausable, IsPaused]').toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this._program.registry.createType('(String, String, bool)', reply.payload);
    return result[2].toJSON() as unknown as boolean;
  }

  public subscribeToPausedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pausable' && getFnNamePrefix(payload) === 'Paused') {
        callback(null);
      }
    });
  }

  public subscribeToUnpausedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pausable' && getFnNamePrefix(payload) === 'Unpaused') {
        callback(null);
      }
    });
  }
}
