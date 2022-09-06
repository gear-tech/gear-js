import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useMemo } from 'react';
import { Lottery } from 'types';
import { useWasm } from './context';

type LotteryState = { LotteryState: Lottery };

function useLotteryState<T>(payload: AnyJson) {
  const lottery = useWasm();
  const { programId, metaBuffer } = lottery || {};

  return useReadState<T>(programId, metaBuffer, payload);
}

function useLottery() {
  const payload = useMemo(() => ({ LotteryState: null }), []);
  const { state, isStateRead } = useLotteryState<LotteryState>(payload);

  return { lottery: state?.LotteryState, isLotteryRead: isStateRead };
}

function useLotteryMessage() {
  const lottery = useWasm();
  const { programId, meta } = lottery || {};

  return useSendMessage(programId || '0x00', meta);
}

export { useLottery, useLotteryMessage };
