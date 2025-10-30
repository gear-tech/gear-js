import { ApiPromise, WsProvider } from '@polkadot/api';
import { DispatchError, Event } from '@polkadot/types/interfaces';
import { u128, u64 } from '@polkadot/types';

import { ExtrinsicFailedData, GearApiOptions, GearCommonGasMultiplier, InflationInfo } from './types';
import { GearEvents } from './events';
import {
  GearBalance,
  GearBlock,
  GearBuiltin,
  GearClaimValue,
  GearCode,
  GearEthBridge,
  GearMailbox,
  GearMessage,
  GearProgram,
  GearProgramState,
  GearProgramStorage,
  GearVoucher,
  GearWaitlist,
} from './api';
import {
  GEAR_BUILTIN_RPC_METHODS,
  GEAR_ETH_BRIDGE_RPC_METHODS,
  GEAR_RPC_METHODS,
  GEAR_TYPES,
  RUNTIME_METHODS,
  STAKING_REWARDS_METHODS,
} from './default';

export class GearApi extends ApiPromise {
  public readonly program: GearProgram;
  /** @deprecated */
  public readonly programState: GearProgramState;
  public readonly programStorage: GearProgramStorage;
  public readonly message: GearMessage;
  public readonly balance: GearBalance;
  public readonly gearEvents: GearEvents;
  public readonly blocks: GearBlock;
  public readonly mailbox: GearMailbox;
  public readonly claimValueFromMailbox: GearClaimValue;
  public readonly code: GearCode;
  public readonly waitlist: GearWaitlist;
  public readonly voucher: GearVoucher;
  public readonly ethBridge: GearEthBridge;
  public readonly builtin: GearBuiltin;
  public readonly provider: WsProvider;
  private _rpcMethods: string[];

  constructor(options: GearApiOptions = {}) {
    const { types = {}, derives = {}, providerAddress, noInitWarn, ...restOptions } = options;
    const provider = restOptions?.provider || new WsProvider(providerAddress ?? 'ws://127.0.0.1:9944');

    super({
      provider,
      derives,
      types: {
        ...types,
        ...GEAR_TYPES,
      },
      rpc: {
        gear: GEAR_RPC_METHODS,
        gearBuiltin: GEAR_BUILTIN_RPC_METHODS,
        gearEthBridge: GEAR_ETH_BRIDGE_RPC_METHODS,
        stakingRewards: STAKING_REWARDS_METHODS,
        runtime: RUNTIME_METHODS,
      },
      runtime: {
        GearApi: [
          {
            methods: {},
            version: 2,
          },
        ],
        Vara: [
          {
            methods: {},
            version: 1,
          },
          {
            methods: {},
            version: 1030,
          },
        ],
        GearBuiltinApi: [{ methods: {}, version: 1 }],
      },
      signedExtensions: {
        StakingBlackList: { extrinsic: {}, payload: {} },
      },
      noInitWarn: noInitWarn ?? true,
      ...restOptions,
    });
    this.provider = provider as WsProvider;

    this.program = new GearProgram(this);
    this.voucher = new GearVoucher(this);
    this.message = new GearMessage(this);
    this.balance = new GearBalance(this);
    this.gearEvents = new GearEvents(this);
    this.programState = new GearProgramState(this);
    this.blocks = new GearBlock(this);
    this.programStorage = new GearProgramStorage(this);
    this.claimValueFromMailbox = new GearClaimValue(this);
    this.mailbox = new GearMailbox(this);
    this.code = new GearCode(this);
    this.waitlist = new GearWaitlist(this);
    this.ethBridge = new GearEthBridge(this);
    this.builtin = new GearBuiltin(this);

    this.isReady
      .then(() => this.rpc.rpc.methods())
      .then((rpc) => {
        this._rpcMethods = rpc.methods.toArray().map((item) => item.toString());
      });
  }

  static async create(options?: GearApiOptions): Promise<GearApi> {
    const api = new GearApi(options);
    await api.isReadyOrError;
    return api;
  }

  async totalIssuance(): Promise<string> {
    return (await this.query.balances.totalIssuance()).toHuman() as string;
  }

  async chain(): Promise<string> {
    return (await this.rpc.system.chain()).toHuman();
  }

  async nodeName(): Promise<string> {
    return (await this.rpc.system.name()).toHuman();
  }

  async nodeVersion(): Promise<string> {
    return (await this.rpc.system.version()).toHuman();
  }

  get specVersion(): number {
    return this.runtimeVersion.specVersion.toNumber();
  }

  get specName(): string {
    return this.runtimeVersion.specName.toString();
  }

  get existentialDeposit(): u128 {
    return this.consts.balances.existentialDeposit as unknown as u128;
  }

  get blockGasLimit(): u64 {
    return this.consts.gearGas.blockGasLimit as unknown as u64;
  }

  get mailboxTreshold(): u64 {
    return this.consts.gear.mailboxThreshold as unknown as u64;
  }

  get waitlistCost(): u64 {
    return this.consts.gearScheduler.waitlistCost as unknown as u64;
  }

  get valuePerGas(): u128 {
    const gasMultiplier = this.consts.gearBank.gasMultiplier as GearCommonGasMultiplier;
    if (gasMultiplier.isValuePerGas) {
      return gasMultiplier.asValuePerGas;
    }
  }

  async inflationInfo(): Promise<InflationInfo> {
    const info = await this.rpc.stakingRewards.inflationInfo();
    return this.createType<InflationInfo>('InflationInfo', info);
  }

  async wasmBlobVersion(): Promise<string> {
    const result = await this.rpc['runtime'].wasmBlobVersion();
    return result.toString();
  }

  /**
   * Method provides opportunity to get informations about error occurs in ExtrinsicFailed event
   * @param event
   * @returns
   */
  getExtrinsicFailedError(event: Event): ExtrinsicFailedData {
    const error = event.data[0] as DispatchError;
    if (error.isModule) {
      const data = this.registry.findMetaError(error.asModule);
      return {
        docs: data?.docs.join(' '),
        method: data?.method,
        name: data?.name,
      };
    }
    if (error.isCannotLookup) {
      return {
        docs: null,
        method: 'CannotLookup',
        name: 'CannotLookup',
      };
    }
    if (error.isBadOrigin) {
      return {
        docs: null,
        method: 'BadOrigin',
        name: 'BadOrigin',
      };
    }

    return {
      docs: null,
      method: 'Unknown error',
      name: 'Unknown error',
    };
  }

  public get rpcMethods(): string[] {
    if (!this._rpcMethods) {
      throw new Error('RPC methods not available. Ensure API is ready by awaiting api.isReady before accessing rpcMethods.');
    }
    return this._rpcMethods;
  }
}
