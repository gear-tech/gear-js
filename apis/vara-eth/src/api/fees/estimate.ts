import type { Address, Hex } from 'viem';
import { encodeFunctionData } from 'viem';

import { IMIRROR_ABI } from '../../eth/abi/IMirror.js';
import { IROUTER_ABI } from '../../eth/abi/IRouter.js';
import type { EthereumClient } from '../../eth/index.js';
import { ZERO_ADDRESS, ZERO_BYTES32 } from '../../util/constants.js';

// Bounded gas for the blob-bearing requestCodeValidation tx, matching router.contract.ts.
const CODE_VALIDATION_GAS_FLOOR = 100_000n;

/**
 * Discriminated union of operations whose total cost can be estimated.
 */
export type WalletOp =
  | { type: 'sendMessage'; mirror: Address; payload: Hex; value?: bigint }
  | { type: 'sendReply'; mirror: Address; repliedTo: Hex; payload: Hex; value?: bigint }
  | { type: 'claimValue'; mirror: Address; claimedId: Hex }
  | { type: 'uploadCode'; codeSize: number }
  | { type: 'createProgram'; codeId: Hex };

/**
 * Estimated cost of a wallet-level operation.
 *
 * - `gas` is the viem-estimated gas limit for the on-chain transaction.
 * - `ethCostWei` is `gas * latestBaseFeePerGas` — a lower-bound floor; the real
 *   EIP-1559 tip is on top.
 * - `wvaraFee` is the program-level WVARA fee charged by the protocol (only
 *   present for `uploadCode`).
 *
 * For `uploadCode` the blob-fee component is NOT modelled here — callers
 * should budget ~2-3x ethCostWei headroom for the blob portion (varies with
 * `baseFeePerBlobGas`).
 */
export interface FeeEstimate {
  gas: bigint;
  ethCostWei: bigint;
  wvaraFee?: bigint;
}

/**
 * Estimates the total cost of a wallet operation before submitting it.
 */
export async function estimateFee(ethClient: EthereumClient, op: WalletOp): Promise<FeeEstimate> {
  const pc = ethClient.publicClient;

  if (op.type === 'uploadCode') {
    const [block, baseValidationFee, extraFee] = await Promise.all([
      pc.getBlock({ blockTag: 'latest' }),
      ethClient.router.requestCodeValidationBaseFee(),
      ethClient.router.requestCodeValidationExtraFee(),
    ]);
    const baseFee = block.baseFeePerGas ?? 0n;
    return {
      gas: CODE_VALIDATION_GAS_FLOOR,
      ethCostWei: CODE_VALIDATION_GAS_FLOOR * baseFee,
      wvaraFee: baseValidationFee + extraFee,
    };
  }

  // ethClient.signer throws if no signer is set; we want that signal for state-changing ops.
  const account = await ethClient.signer.getAddress();

  let to: Address;
  let data: Hex;
  let value: bigint | undefined;

  switch (op.type) {
    case 'sendMessage': {
      to = op.mirror;
      data = encodeFunctionData({ abi: IMIRROR_ABI, functionName: 'sendMessage', args: [op.payload, false] });
      value = op.value;
      break;
    }
    case 'sendReply': {
      to = op.mirror;
      data = encodeFunctionData({ abi: IMIRROR_ABI, functionName: 'sendReply', args: [op.repliedTo, op.payload] });
      value = op.value;
      break;
    }
    case 'claimValue': {
      to = op.mirror;
      data = encodeFunctionData({ abi: IMIRROR_ABI, functionName: 'claimValue', args: [op.claimedId] });
      break;
    }
    case 'createProgram': {
      to = ethClient.router.address;
      data = encodeFunctionData({
        abi: IROUTER_ABI,
        functionName: 'createProgram',
        args: [op.codeId, ZERO_BYTES32 as Hex, ZERO_ADDRESS as Address],
      });
      break;
    }
    default: {
      const _exhaustive: never = op;
      throw new Error(`Unknown WalletOp: ${JSON.stringify(_exhaustive)}`);
    }
  }

  const [block, gas] = await Promise.all([
    pc.getBlock({ blockTag: 'latest' }),
    pc.estimateGas({ account, to, data, value }),
  ]);
  const baseFee = block.baseFeePerGas ?? 0n;
  return { gas, ethCostWei: gas * baseFee };
}
