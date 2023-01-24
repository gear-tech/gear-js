import { Hex } from '@gear-js/api';
import { useReadFullState, useSendMessage } from '@gear-js/react-hooks';
import metaTxt from 'assets/meta/meta.txt';
import { Lottery } from 'types';
import { useMetadata } from './useMetadata';

const programId = '0xf793f8f10d4a6c37cfee251fa418521bb1d6e8a7d8284c21889a74197e8566e7' as Hex;

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
