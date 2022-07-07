import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useMemo } from 'react';
import lotteryMetaWasm from 'assets/wasm/lottery.meta.wasm';
import { ADDRESS } from 'consts';
import { Lottery } from 'types';

type LotteryState = { LotteryState: Lottery };

function useLotteryState<T>(payload: AnyJson) {
  return useReadState<T>(ADDRESS.LOTTERY_CONTRACT, lotteryMetaWasm, payload);
}

function useLottery() {
  const payload = useMemo(() => ({ LotteryState: null }), []);
  const { state, isStateRead } = useLotteryState<LotteryState>(payload);

  return { lottery: state?.LotteryState, isLotteryRead: isStateRead };
}

function useLotteryMessage() {
  return useSendMessage(ADDRESS.LOTTERY_CONTRACT, lotteryMetaWasm);
}

export { useLottery, useLotteryMessage };
