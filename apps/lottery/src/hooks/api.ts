import { useReadState, useSendMessage } from '@gear-js/react-hooks';
import { Hex } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useMemo } from 'react';
import lotteryMetaWasm from 'assets/wasm/lottery.meta.wasm';
import { ADDRESS } from 'consts';
import { Player } from 'types';

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

type PlayersState = { Players: { [key: number]: Player } };

function useLotteryState<T>(payload: AnyJson) {
  return useReadState<T>(ADDRESS.LOTTERY_CONTRACT, lotteryMetaWasm, payload);
}

function useLottery() {
  const payload = useMemo(() => ({ LotteryState: null }), []);
  const { state, isStateRead } = useLotteryState<LotteryState>(payload);

  return { lottery: state?.LotteryState, isLotteryRead: isStateRead };
}

function usePlayers() {
  const payload = useMemo(() => ({ GetPlayers: null }), []);
  const { state, isStateRead } = useLotteryState<PlayersState>(payload);

  return { players: state ? Object.values(state.Players) : [], isPlayersStateRead: isStateRead };
}

function useLotteryMessage() {
  return useSendMessage(ADDRESS.LOTTERY_CONTRACT, lotteryMetaWasm);
}

export { useLottery, usePlayers, useLotteryMessage };
