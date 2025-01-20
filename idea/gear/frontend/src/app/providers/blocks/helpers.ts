import { Header } from '@polkadot/types/interfaces';

const getTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString();

const getBlock = ({ hash, number }: Header, time: string) => ({
  hash: hash.toHex(),
  number: number.toNumber(),
  time,
});

export { getTime, getBlock };
