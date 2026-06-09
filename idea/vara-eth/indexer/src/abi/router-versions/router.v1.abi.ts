import { IROUTER_ABI } from '@vara-eth/api/abi';
import type { Abi } from 'viem';

// commitBatch before hasAggregatedPublicKey was added to ValidatorsCommitment
// https://github.com/gear-tech/gear-js/commit/8fa4699e34a4da2a614ffd281e6c9e18e718158b
const _commitBatchV1 = {
  type: 'function',
  name: 'commitBatch',
  inputs: [
    {
      name: '_batch',
      type: 'tuple',
      internalType: 'struct Gear.BatchCommitment',
      components: [
        { name: 'blockHash', type: 'bytes32', internalType: 'bytes32' },
        { name: 'blockTimestamp', type: 'uint48', internalType: 'uint48' },
        { name: 'previousCommittedBatchHash', type: 'bytes32', internalType: 'bytes32' },
        { name: 'expiry', type: 'uint8', internalType: 'uint8' },
        {
          name: 'chainCommitment',
          type: 'tuple[]',
          internalType: 'struct Gear.ChainCommitment[]',
          components: [
            {
              name: 'transitions',
              type: 'tuple[]',
              internalType: 'struct Gear.StateTransition[]',
              components: [
                { name: 'actorId', type: 'address', internalType: 'address' },
                { name: 'newStateHash', type: 'bytes32', internalType: 'bytes32' },
                { name: 'exited', type: 'bool', internalType: 'bool' },
                { name: 'inheritor', type: 'address', internalType: 'address' },
                { name: 'valueToReceive', type: 'uint128', internalType: 'uint128' },
                { name: 'valueToReceiveNegativeSign', type: 'bool', internalType: 'bool' },
                {
                  name: 'valueClaims',
                  type: 'tuple[]',
                  internalType: 'struct Gear.ValueClaim[]',
                  components: [
                    { name: 'messageId', type: 'bytes32', internalType: 'bytes32' },
                    { name: 'destination', type: 'address', internalType: 'address' },
                    { name: 'value', type: 'uint128', internalType: 'uint128' },
                  ],
                },
                {
                  name: 'messages',
                  type: 'tuple[]',
                  internalType: 'struct Gear.Message[]',
                  components: [
                    { name: 'id', type: 'bytes32', internalType: 'bytes32' },
                    { name: 'destination', type: 'address', internalType: 'address' },
                    { name: 'payload', type: 'bytes', internalType: 'bytes' },
                    { name: 'value', type: 'uint128', internalType: 'uint128' },
                    {
                      name: 'replyDetails',
                      type: 'tuple',
                      internalType: 'struct Gear.ReplyDetails',
                      components: [
                        { name: 'to', type: 'bytes32', internalType: 'bytes32' },
                        { name: 'code', type: 'bytes4', internalType: 'bytes4' },
                      ],
                    },
                    { name: 'call', type: 'bool', internalType: 'bool' },
                  ],
                },
              ],
            },
            { name: 'head', type: 'bytes32', internalType: 'bytes32' },
          ],
        },
        {
          name: 'codeCommitments',
          type: 'tuple[]',
          internalType: 'struct Gear.CodeCommitment[]',
          components: [
            { name: 'id', type: 'bytes32', internalType: 'bytes32' },
            { name: 'valid', type: 'bool', internalType: 'bool' },
          ],
        },
        {
          name: 'rewardsCommitment',
          type: 'tuple[]',
          internalType: 'struct Gear.RewardsCommitment[]',
          components: [
            {
              name: 'operators',
              type: 'tuple',
              internalType: 'struct Gear.OperatorRewardsCommitment',
              components: [
                { name: 'amount', type: 'uint256', internalType: 'uint256' },
                { name: 'root', type: 'bytes32', internalType: 'bytes32' },
              ],
            },
            {
              name: 'stakers',
              type: 'tuple',
              internalType: 'struct Gear.StakerRewardsCommitment',
              components: [
                {
                  name: 'distribution',
                  type: 'tuple[]',
                  internalType: 'struct Gear.StakerRewards[]',
                  components: [
                    { name: 'vault', type: 'address', internalType: 'address' },
                    { name: 'amount', type: 'uint256', internalType: 'uint256' },
                  ],
                },
                { name: 'totalAmount', type: 'uint256', internalType: 'uint256' },
                { name: 'token', type: 'address', internalType: 'address' },
              ],
            },
            { name: 'timestamp', type: 'uint48', internalType: 'uint48' },
          ],
        },
        {
          name: 'validatorsCommitment',
          type: 'tuple[]',
          internalType: 'struct Gear.ValidatorsCommitment[]',
          components: [
            {
              name: 'aggregatedPublicKey',
              type: 'tuple',
              internalType: 'struct Gear.AggregatedPublicKey',
              components: [
                { name: 'x', type: 'uint256', internalType: 'uint256' },
                { name: 'y', type: 'uint256', internalType: 'uint256' },
              ],
            },
            { name: 'verifiableSecretSharingCommitment', type: 'bytes', internalType: 'bytes' },
            { name: 'validators', type: 'address[]', internalType: 'address[]' },
            { name: 'eraIndex', type: 'uint256', internalType: 'uint256' },
          ],
        },
      ],
    },
    { name: '_signatureType', type: 'uint8', internalType: 'enum Gear.SignatureType' },
    { name: '_signatures', type: 'bytes[]', internalType: 'bytes[]' },
  ],
  outputs: [],
  stateMutability: 'nonpayable',
} as const;

export const IROUTER_ABI_V1: Abi = [
  ...IROUTER_ABI.filter((item) => !(item.type === 'function' && 'name' in item && item.name === 'commitBatch')),
  _commitBatchV1,
];
