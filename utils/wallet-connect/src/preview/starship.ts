/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GearApi, BaseGearProgram, HexString, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import {
  TransactionBuilder,
  ActorId,
  throwOnErrorReply,
  getServiceNamePrefix,
  getFnNamePrefix,
  ZERO_ADDRESS,
} from 'sails-js';

export interface Config {
  ft_contract: ActorId;
  nft_contract: ActorId;
  ship_price: number | string | bigint;
  attempt_price: number | string | bigint;
  booster_price: number | string | bigint;
  one_point_in_value: number | string | bigint;
  default_name: string;
  default_free_attempts: number;
  default_boosters: number;
  default_level_ship: number;
  max_level_ship: number;
  daily_reset_offset_ms: number | string | bigint;
}

export interface PlayerInfo {
  player_name: string;
  earned_points: number | string | bigint;
  number_of_attempts: number;
  number_of_boosters: number;
  ship_level: number;
  attempt_timestamp: number | string | bigint;
}

export class SailsProgram {
  public readonly registry: TypeRegistry;
  public readonly starship: Starship;
  private _program!: BaseGearProgram;

  constructor(
    public api: GearApi,
    programId?: `0x${string}`,
  ) {
    const types: Record<string, any> = {
      Config: {
        ft_contract: '[u8;32]',
        nft_contract: '[u8;32]',
        ship_price: 'u128',
        attempt_price: 'u128',
        booster_price: 'u128',
        one_point_in_value: 'u128',
        default_name: 'String',
        default_free_attempts: 'u16',
        default_boosters: 'u16',
        default_level_ship: 'u16',
        max_level_ship: 'u16',
        daily_reset_offset_ms: 'u64',
      },
      PlayerInfo: {
        player_name: 'String',
        earned_points: 'u128',
        number_of_attempts: 'u16',
        number_of_boosters: 'u16',
        ship_level: 'u16',
        attempt_timestamp: 'u64',
      },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
    if (programId) {
      this._program = new BaseGearProgram(programId, api);
    }

    this.starship = new Starship(this);
  }

  public get programId(): `0x${string}` {
    if (!this._program) throw new Error(`Program ID is not set`);
    return this._program.id;
  }

  newCtorFromCode(code: Uint8Array | Buffer | HexString, config: Config): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      undefined,
      'New',
      config,
      'Config',
      'String',
      code,
      async (programId) => {
        this._program = await BaseGearProgram.new(programId, this.api);
      },
    );
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`, config: Config) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      undefined,
      'New',
      config,
      'Config',
      'String',
      codeId,
      async (programId) => {
        this._program = await BaseGearProgram.new(programId, this.api);
      },
    );
    return builder;
  }
}

export class Starship {
  constructor(private _program: SailsProgram) {}

  public addPoints(points: number | string | bigint, num_spent_boosters: number): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      'Starship',
      'AddPoints',
      [points, num_spent_boosters],
      '(u128, u16)',
      'Null',
      this._program.programId,
    );
  }

  public buyAttempt(): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      'Starship',
      'BuyAttempt',
      undefined,
      'Null',
      'Null',
      this._program.programId,
    );
  }

  public buyBooster(): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      'Starship',
      'BuyBooster',
      undefined,
      'Null',
      'Null',
      this._program.programId,
    );
  }

  public buyNewShip(): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      'Starship',
      'BuyNewShip',
      undefined,
      'Null',
      'Null',
      this._program.programId,
    );
  }

  public buyPoints(points_amount: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      'Starship',
      'BuyPoints',
      points_amount,
      'u128',
      'Null',
      this._program.programId,
    );
  }

  public changeAdmin(new_admin: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      'Starship',
      'ChangeAdmin',
      new_admin,
      '[u8;32]',
      'Null',
      this._program.programId,
    );
  }

  public changeConfig(config: Config): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      'Starship',
      'ChangeConfig',
      config,
      'Config',
      'Null',
      this._program.programId,
    );
  }

  public setName(name: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      'Starship',
      'SetName',
      name,
      'String',
      'Null',
      this._program.programId,
    );
  }

  public withdrawalOfValues(to: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      'Starship',
      'WithdrawalOfValues',
      to,
      '[u8;32]',
      'Null',
      this._program.programId,
    );
  }

  public async allPlayersInfo(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<[ActorId, PlayerInfo]>> {
    const payload = this._program.registry.createType('(String, String)', ['Starship', 'AllPlayersInfo']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, Vec<([u8;32], PlayerInfo)>)', reply.payload);
    return result[2].toJSON() as unknown as Array<[ActorId, PlayerInfo]>;
  }

  public async config(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Config> {
    const payload = this._program.registry.createType('(String, String)', ['Starship', 'Config']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, Config)', reply.payload);
    return result[2].toJSON() as unknown as Config;
  }

  public async numberOfAttempts(
    player: ActorId,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<number> {
    const payload = this._program.registry
      .createType('(String, String, [u8;32])', ['Starship', 'NumberOfAttempts', player])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, u16)', reply.payload);
    return result[2].toNumber() as unknown as number;
  }

  public async playerInfo(
    player: ActorId,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<PlayerInfo> {
    const payload = this._program.registry
      .createType('(String, String, [u8;32])', ['Starship', 'PlayerInfo', player])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, PlayerInfo)', reply.payload);
    return result[2].toJSON() as unknown as PlayerInfo;
  }

  public async timeToFreeAttempts(
    player: ActorId,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<bigint> {
    const payload = this._program.registry
      .createType('(String, String, [u8;32])', ['Starship', 'TimeToFreeAttempts', player])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, u64)', reply.payload);
    return result[2].toBigInt() as unknown as bigint;
  }

  public subscribeToPointsAddedEvent(
    callback: (data: { player: ActorId; points: number | string | bigint }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Starship' && getFnNamePrefix(payload) === 'PointsAdded') {
        callback(
          this._program.registry
            .createType('(String, String, {"player":"[u8;32]","points":"u128"})', message.payload)[2]
            .toJSON() as unknown as { player: ActorId; points: number | string | bigint },
        );
      }
    });
  }

  public subscribeToPointsBoughtEvent(callback: (data: bigint) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Starship' && getFnNamePrefix(payload) === 'PointsBought') {
        callback(
          this._program.registry
            .createType('(String, String, u128)', message.payload)[2]
            .toBigInt() as unknown as bigint,
        );
      }
    });
  }

  public subscribeToNewShipBoughtEvent(
    callback: (data: { player: ActorId; level: number }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Starship' && getFnNamePrefix(payload) === 'NewShipBought') {
        callback(
          this._program.registry
            .createType('(String, String, {"player":"[u8;32]","level":"u16"})', message.payload)[2]
            .toJSON() as unknown as { player: ActorId; level: number },
        );
      }
    });
  }

  public subscribeToValuesHaveBeenWithdrawnEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Starship' && getFnNamePrefix(payload) === 'ValuesHaveBeenWithdrawn') {
        callback(null);
      }
    });
  }

  public subscribeToConfigChangedEvent(callback: (data: Config) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Starship' && getFnNamePrefix(payload) === 'ConfigChanged') {
        callback(
          this._program.registry
            .createType('(String, String, Config)', message.payload)[2]
            .toJSON() as unknown as Config,
        );
      }
    });
  }

  public subscribeToAdminChangedEvent(callback: (data: ActorId) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Starship' && getFnNamePrefix(payload) === 'AdminChanged') {
        callback(
          this._program.registry
            .createType('(String, String, [u8;32])', message.payload)[2]
            .toJSON() as unknown as ActorId,
        );
      }
    });
  }

  public subscribeToNameSetEvent(
    callback: (data: { player: ActorId; name: string }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Starship' && getFnNamePrefix(payload) === 'NameSet') {
        callback(
          this._program.registry
            .createType('(String, String, {"player":"[u8;32]","name":"String"})', message.payload)[2]
            .toJSON() as unknown as { player: ActorId; name: string },
        );
      }
    });
  }

  public subscribeToAttemptBoughtEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Starship' && getFnNamePrefix(payload) === 'AttemptBought') {
        callback(null);
      }
    });
  }

  public subscribeToBoosterBoughtEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Starship' && getFnNamePrefix(payload) === 'BoosterBought') {
        callback(null);
      }
    });
  }
}
