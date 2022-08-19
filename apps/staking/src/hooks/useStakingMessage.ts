import { useSendMessage } from '@gear-js/react-hooks';

import { STAKING_CONTRACT_ADDRESS } from 'consts';
import stakingMetaWasm from 'assets/wasm/staking.meta.wasm';

function useStakingMessage() {
  return useSendMessage(STAKING_CONTRACT_ADDRESS, stakingMetaWasm);
}

export { useStakingMessage };
