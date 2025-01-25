import { ethers } from 'ethers';
import { assertEnv, config } from './config';

export const hasProps = (obj: object, props: string[]) => {
  expect(Object.keys(obj)).toHaveLength(props.length);

  props.forEach((prop) => {
    expect(obj).toHaveProperty(prop);
  });
};

export const ethWsProvider = () => new ethers.WebSocketProvider(assertEnv('WS_RPC'));

export const waitNBlocks = async (count: number) =>
  new Promise((resolve) => setTimeout(resolve, count * config.blockTime + 1_000));
