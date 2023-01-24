import { Hex } from '@gear-js/api';
import { useReadFullState, useSendMessage } from '@gear-js/react-hooks';
import metaTxt from 'assets/meta/meta.txt';
import { Lottery } from 'types';
import { useMetadata } from './useMetadata';

const programId = '0x986de5d9fa9b53a47e2f64b837b0d5668fb5b7d5b5935671626d1b1671d1341d' as Hex;

function useLotteryMetadata() {
  return useMetadata(metaTxt);
}

function useLotteryState() {
  const meta = useLotteryMetadata();

  return useReadFullState<Lottery>(programId, meta);
}

function useLotteryMessage() {
  const meta = useLotteryMetadata();

  return useSendMessage(programId, meta);
}

export { useLotteryState, useLotteryMessage };
