import type { Hex } from '@gear-js/api';
import { useSendMessage } from '@gear-js/react-hooks';
import { useTokensBalanceStore } from '../context';

export function useTokensMessage() {
  const { metaMain, programId } = useTokensBalanceStore();
  return useSendMessage(programId as Hex, metaMain);
}
