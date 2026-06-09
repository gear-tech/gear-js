import { IROUTER_ABI } from '@vara-eth/api/abi';
import type {
  Abi,
  AbiFunction,
  Address,
  ContractEventName,
  ContractFunctionName,
  DecodeEventLogReturnType,
  DecodeFunctionDataReturnType,
  Hex,
} from 'viem';
import { decodeEventLog, decodeFunctionData, encodeEventTopics, getAbiItem, toFunctionSelector } from 'viem/utils';
import type { Log, Transaction } from '../processor.js';
import { IROUTER_ABI_V1 } from './router-versions/router.v1.abi.js';

// ── EIP-1967 Upgraded event ──────────────────────────────────────────────────
// Fixed by standard; signature never changes between contract upgrades.
const _UPGRADED_ABI = [
  { type: 'event', name: 'Upgraded', inputs: [{ name: 'implementation', type: 'address', indexed: true }] },
] as const;

export const ROUTER_UPGRADED_TOPIC: Hex = encodeEventTopics({ abi: _UPGRADED_ABI, eventName: 'Upgraded' })[0];

export function decodeUpgradedEvent(log: Log): { implementation: Address } {
  const result = decodeEventLog({
    abi: _UPGRADED_ABI,
    eventName: 'Upgraded',
    data: log.data as Hex,
    topics: log.topics as [Hex, ...Hex[]],
  });
  return { implementation: result.args.implementation as Address };
}

// ── ABI factory ──────────────────────────────────────────────────────────────
// Builds the RouterAbi helper object from any structurally compatible ABI.
// Accepts Abi (widened type) so older versions can be passed without unsafe casts.
// Decode return types are anchored to IROUTER_ABI for IDE completion on the default case.
function createRouterAbi(abi: Abi) {
  function eventTopic(name: ContractEventName<typeof IROUTER_ABI>): Hex {
    return encodeEventTopics({ abi, eventName: name })[0];
  }
  function eventDecoder<TName extends ContractEventName<typeof IROUTER_ABI>>(eventName: TName) {
    return (log: Log): DecodeEventLogReturnType<typeof IROUTER_ABI, TName> =>
      decodeEventLog({
        abi,
        data: log.data as Hex,
        eventName,
        topics: log.topics as [Hex, ...Hex[]],
      }) as DecodeEventLogReturnType<typeof IROUTER_ABI, TName>;
  }
  function fnDecoder<TName extends ContractFunctionName<typeof IROUTER_ABI>>(fnName: TName) {
    return (tx: Transaction): DecodeFunctionDataReturnType<typeof IROUTER_ABI, TName> =>
      decodeFunctionData({ abi, data: tx.input as Hex }) as DecodeFunctionDataReturnType<typeof IROUTER_ABI, TName>;
  }
  function fnSelector(name: ContractFunctionName<typeof IROUTER_ABI>): string {
    return toFunctionSelector(getAbiItem({ abi, name }) as AbiFunction);
  }
  return {
    events: {
      AnnouncesCommitted: { topic: eventTopic('AnnouncesCommitted'), decode: eventDecoder('AnnouncesCommitted') },
      BatchCommitted: { topic: eventTopic('BatchCommitted'), decode: eventDecoder('BatchCommitted') },
      CodeGotValidated: { topic: eventTopic('CodeGotValidated'), decode: eventDecoder('CodeGotValidated') },
      CodeValidationRequested: {
        topic: eventTopic('CodeValidationRequested'),
        decode: eventDecoder('CodeValidationRequested'),
      },
      ProgramCreated: { topic: eventTopic('ProgramCreated'), decode: eventDecoder('ProgramCreated') },
      ValidatorsCommittedForEra: {
        topic: eventTopic('ValidatorsCommittedForEra'),
        decode: eventDecoder('ValidatorsCommittedForEra'),
      },
    },
    functions: {
      requestCodeValidation: {
        selector: fnSelector('requestCodeValidation'),
        decode: fnDecoder('requestCodeValidation'),
      },
      createProgram: { selector: fnSelector('createProgram'), decode: fnDecoder('createProgram') },
      createProgramWithAbiInterface: {
        selector: fnSelector('createProgramWithAbiInterface'),
        decode: fnDecoder('createProgramWithAbiInterface'),
      },
      commitBatch: { selector: fnSelector('commitBatch'), decode: fnDecoder('commitBatch') },
    },
  } as const;
}

export type RouterAbiShape = ReturnType<typeof createRouterAbi>;

// ── Default (latest) ABI instance ────────────────────────────────────────────
export const RouterAbi = createRouterAbi(IROUTER_ABI);

// ── Implementation address → ABI registry ────────────────────────────────────
// EVERY known implementation address must be listed here.
// Keys are lowercase hex addresses.
//
// Keys are version strings (e.g. 'v1', 'v2'). Chain-specific impl addresses live in the DB.
//
// HOW TO ADD A NEW VERSION before an upgrade:
//   1. Create src/abi/router-versions/router.vN.abi.ts extending the previous version
//      and replacing only the changed function(s).
//   2. Import it here and add an entry: 'vN': createRouterAbi(IROUTER_ABI_VN).
//   3. Pre-seed the DB per chain: INSERT INTO router_implementation (id, from_block, version)
//      VALUES ('<new_impl_addr>', <upgrade_block>, 'vN+1') — do this before the upgrade block.
//   4. Deploy indexer BEFORE the upgrade transaction is mined.
export const ROUTER_VERSION_TO_ABI: Record<string, RouterAbiShape> = {
  v1: createRouterAbi(IROUTER_ABI_V1),
  v2: RouterAbi,
};

// ── Aggregate topics / selectors across all known versions ───────────────────
// Always includes RouterAbi (latest) plus any older versions in ROUTER_IMPL_TO_ABI.
export function getAllRouterEventTopics(): Hex[] {
  const allInstances = [RouterAbi, ...Object.values(ROUTER_VERSION_TO_ABI)];
  return Array.from(new Set(allInstances.flatMap((a) => Object.values(a.events).map((e) => e.topic))));
}

export function getAllRouterFunctionSelectors(): string[] {
  const allInstances = [RouterAbi, ...Object.values(ROUTER_VERSION_TO_ABI)];
  return Array.from(new Set(allInstances.flatMap((a) => Object.values(a.functions).map((f) => f.selector))));
}
