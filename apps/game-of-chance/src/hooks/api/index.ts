import { useReadFullState, useSendMessage } from '@gear-js/react-hooks';
import metaTxt from 'assets/meta/meta.txt';
import { ADDRESS } from 'consts';
import { Lottery } from 'types';
import { useMetadata } from './useMetadata';

function useLotteryMetadata() {
  return useMetadata(metaTxt);
}

function useLotteryState() {
  const meta = useLotteryMetadata();

  return useReadFullState<Lottery>(ADDRESS.CONTRACT, meta);
}

function useLotteryMessage() {
  const meta = useLotteryMetadata();

  return useSendMessage(ADDRESS.CONTRACT, meta);
}

export { useLotteryState, useLotteryMessage };
