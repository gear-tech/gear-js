import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { construct, decode, deriveAddress } from '@substrate/txwrapper-core';
import { rpcToLocalNode, signWith } from './util';
import { getRegistry, methods } from '../src';

const main = async () => {
  await cryptoWaitReady();
  // Create a new keyring, and add an "Alice" account
  const keyring = new Keyring();
  const alice = keyring.addFromUri('//Alice', { name: 'Alice' }, 'sr25519');
  const address = deriveAddress(alice.publicKey, 42);
  console.log("Alice's SS58-Encoded Address:", address);

  const { block } = await rpcToLocalNode('chain_getBlock');
  const blockHash = await rpcToLocalNode('chain_getBlockHash');
  const nonce = await rpcToLocalNode('system_accountNextIndex', [address]);
  const genesisHash = await rpcToLocalNode('chain_getBlockHash', [0]);
  const metadataRpc = await rpcToLocalNode('state_getMetadata');
  const { specVersion, transactionVersion, specName } = await rpcToLocalNode('state_getRuntimeVersion');
  const { ss58format, tokenDecimals, tokenSymbol } = await rpcToLocalNode('system_properties');
  const chainName = await rpcToLocalNode('system_chain');

  const registry = getRegistry({
    specName,
    specVersion,
    metadataRpc,
    chainProperties: { tokenDecimals: [tokenDecimals], tokenSymbol: [tokenSymbol], ss58Format: ss58format },
    chainName,
  });

  const unsigned = methods.gear.sendMessage(
    {
      destination: '0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48',
      payload: '0x50494e47',
      gasLimit: 1000000,
      value: 0,
    },
    {
      address,
      blockHash,
      blockNumber: registry.createType('BlockNumber', block.header.number).toNumber(),
      eraPeriod: 2400,
      genesisHash,
      metadataRpc,
      nonce,
      specVersion,
      transactionVersion,
      tip: 0,
    },
    { metadataRpc, registry },
  );

  const decodedUnsigned = decode(unsigned, {
    metadataRpc,
    registry,
  });
  console.log(
    `\nDecoded Transaction\n  Destination: ${decodedUnsigned.method.args.destination}\n` +
      `  Payload: ${decodedUnsigned.method.args.payload}\n` +
      `  GasLimit: ${decodedUnsigned.method.args.gasLimit}\n` +
      `  Value: ${decodedUnsigned.method.args.value}\n`,
  );

  const signingPayload = construct.signingPayload(unsigned, { registry });
  console.log(`\nPayload to Sign: ${signingPayload}`);

  const payloadInfo = decode(signingPayload, {
    metadataRpc,
    registry,
  });
  console.log(
    `\nDecoded Transaction\n  Destination: ${payloadInfo.method.args.destination}\n` +
      `  Payload: ${payloadInfo.method.args.payload}\n` +
      `  GasLimit: ${payloadInfo.method.args.gasLimit}\n` +
      `  Value: ${payloadInfo.method.args.value}\n`,
  );

  const signature = signWith(alice, signingPayload, {
    metadataRpc,
    registry,
  });
  console.log(`\nSignature: ${signature}`);

  const tx = construct.signedTx(unsigned, signature, {
    metadataRpc,
    registry,
  });
  console.log(`\nTransaction to Submit: ${tx}`);

  const expectedTxHash = construct.txHash(tx);
  console.log(`\nExpected Tx Hash: ${expectedTxHash}`);

  const actualTxHash = await rpcToLocalNode('author_submitExtrinsic', [tx]);
  console.log(`Actual Tx Hash: ${actualTxHash}`);

  const txInfo = decode(tx, {
    metadataRpc,
    registry,
  });
  console.log(
    `\nDecoded Transaction\n  Destination: ${txInfo.method.args.destination}\n` +
      `  Payload: ${txInfo.method.args.payload}\n` +
      `  GasLimit: ${txInfo.method.args.gasLimit}\n` +
      `  Value: ${txInfo.method.args.value}\n`,
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
