import { ApiPromise, WsProvider } from '@polkadot/api';
import { DispatchError, Event } from '@polkadot/types/interfaces';
import { u128, u64 } from '@polkadot/types';

import { ExtrinsicFailedData, GearApiOptions, GearCommonGasMultiplier, InflationInfo } from './types';
import { gearRpc, gearTypes } from './default';
import { GearBalance } from './Balance';
import { GearBlock } from './Blocks';
import { GearClaimValue } from './Claim';
import { GearCode } from './Code';
import { GearEvents } from './events';
import { GearMailbox } from './Mailbox';
import { GearMessage } from './Message';
import { GearProgram } from './Program';
import { GearProgramState } from './State';
import { GearProgramStorage } from './Storage';
import { GearVoucher } from './Voucher';
import { GearWaitlist } from './Waitlist';

export class GearApi extends ApiPromise {
  public program: GearProgram;
  public programState: GearProgramState;
  public programStorage: GearProgramStorage;
  public message: GearMessage;
  public balance: GearBalance;
  public gearEvents: GearEvents;
  public defaultTypes: Record<string, unknown>;
  public blocks: GearBlock;
  public mailbox: GearMailbox;
  public claimValueFromMailbox: GearClaimValue;
  public code: GearCode;
  public waitlist: GearWaitlist;
  public voucher: GearVoucher;
  public provider: WsProvider;

  constructor(options: GearApiOptions = {}) {
    const { types, providerAddress, ...restOptions } = options;
    const provider = restOptions?.provider || new WsProvider(providerAddress ?? 'ws://127.0.0.1:9944');
    const defaultTypes = types ? { ...types, ...gearTypes } : gearTypes;

    super({
      provider,
      derives: {},
      types: {
        ...defaultTypes,
      },
      rpc: {
        ...gearRpc,
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
      },
      signedExtensions: {
        VoucherLegitimate: { extrinsic: {}, payload: {} },
        StakingBlackList: { extrinsic: {}, payload: {} },
      },
      ...restOptions,
    });
    this.provider = provider as WsProvider;

    this.program = new GearProgram(this);
    this.voucher = new GearVoucher(this);
    this.message = new GearMessage(this);
    this.balance = new GearBalance(this);
    this.gearEvents = new GearEvents(this);
    this.defaultTypes = defaultTypes;
    this.programState = new GearProgramState(this);
    this.blocks = new GearBlock(this);
    this.programStorage = new GearProgramStorage(this);
    this.claimValueFromMailbox = new GearClaimValue(this);
    this.mailbox = new GearMailbox(this);
    this.code = new GearCode(this);
    this.waitlist = new GearWaitlist(this);
  }

  static async create(options?: GearApiOptions): Promise<GearApi> {
    const api = new GearApi(options);
    await api.isReady;
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
}
