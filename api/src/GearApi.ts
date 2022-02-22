import { GearProgram } from './Program';
import { GearMessage } from './Message';
import { GearBalance } from './Balance';
import { GearEvents } from './Events';
import { GearProgramState } from './State';
import { GearMessageReply } from './MessageReply';
import { transformTypes } from './utils';
import { gearRpc, gearTypes } from './default';
import { GearApiOptions } from './interfaces';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { EventRecord } from '@polkadot/types/interfaces';
import { PromiseResult } from '@polkadot/api/types';
import { Vec } from '@polkadot/types';
import { Observable } from 'rxjs';
import { GearBlock } from './Blocks';
import { GearStorage } from './Storage';
import { GearMailbox } from './Mailbox';
import { GearClaimValue } from './Claim';
import { GearCode } from './Code';

export class GearApi extends ApiPromise {
  public program: GearProgram;
  public programState: GearProgramState;
  public message: GearMessage;
  public reply: GearMessageReply;
  public balance: GearBalance;
  public allEvents: PromiseResult<() => Observable<Vec<EventRecord>>>;
  public gearEvents: GearEvents;
  public defaultTypes: any;
  public blocks: GearBlock;
  public storage: GearStorage;
  public mailbox: GearMailbox;
  public claimValueFromMailbox: GearClaimValue;
  public code: GearCode;

  constructor(options?: GearApiOptions) {
    const provider = options?.provider
      ? options.provider
      : new WsProvider(options?.providerAddress ?? 'ws://127.0.0.1:9944');

    const defaultTypes = options?.customTypes
      ? {
          ...gearTypes,
          ...transformTypes(
            'types' in options.customTypes ? options.customTypes : { types: { ...options.customTypes } },
          ),
        }
      : gearTypes;
    super({
      provider,
      derives: {},
      types: {
        ...defaultTypes,
      },
      rpc: {
        ...gearRpc,
      },
      ...options,
    });
    this.isReady.then(() => {
      this.program = new GearProgram(this);
      this.message = new GearMessage(this);
      this.balance = new GearBalance(this);
      this.reply = new GearMessageReply(this);
      this.allEvents = this.query.system.events;
      this.gearEvents = new GearEvents(this);
      this.defaultTypes = defaultTypes;
      this.programState = new GearProgramState(this);
      this.blocks = new GearBlock(this);
      this.storage = new GearStorage(this);
      this.claimValueFromMailbox = new GearClaimValue(this);
      this.mailbox = new GearMailbox(this);
      this.code = new GearCode(this);
    });
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
}
