import { useSendMessage } from '@gear-js/react-hooks';
import { useTokensBalanceStore } from '../context';
import { HexString } from '@polkadot/util/types';

export function useFtMessage() {
  const { metaMain, programId } = useTokensBalanceStore();
  return useSendMessage(programId as HexString, metaMain);
}
