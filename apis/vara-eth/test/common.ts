import { createPublicClient, createWalletClient, Hex, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { config } from './config';
import { EthereumClient, getWrappedVaraClient } from '../src';

export const hasProps = (obj: object, props: string[]) => {
  expect(Object.keys(obj)).toHaveLength(props.length);

  props.forEach((prop) => {
    expect(obj).toHaveProperty(prop);
  });
};

export const waitNBlocks = async (count: number) =>
  new Promise((resolve) => setTimeout(resolve, count * config.blockTime * 1_000));

export const topupBalance = async (wvaraAddr: Hex) => {
  const account = privateKeyToAccount(config.wvaraPrefundedPrivateKey);

  const transport = webSocket(config.wsRpc);

  const publicClient = createPublicClient({
    transport,
  });
  const walletClient = createWalletClient({
    account,
    transport,
  });

  const ethereumClient = new EthereumClient(publicClient, walletClient);

  const wvara = getWrappedVaraClient(wvaraAddr, ethereumClient);

  const transferTx = await wvara.transfer(config.accountAddress, BigInt(50 * 1e12));
  await transferTx.sendAndWaitForReceipt();
};
