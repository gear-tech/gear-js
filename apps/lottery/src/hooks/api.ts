import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { useMemo } from 'react';
import { AnyJson } from '@polkadot/types/types';
import lotteryMetaWasm from 'assets/wasm/lottery.meta.wasm';
import { ADDRESS } from 'consts';
import { Hex } from '@gear-js/api';

type LotteryState = {
  LotteryState: {
    lotteryOwner: Hex;
    lotteryStarted: boolean;
    lotteryStartTime: string;
    lotteryDuration: string;
    participationCost: string;
    prizeFund: string;
  };
};

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
