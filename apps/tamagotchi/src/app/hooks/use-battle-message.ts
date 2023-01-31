import { useSendMessage } from '@gear-js/react-hooks';
import { useBattle } from '../context';
import { HexString } from '@polkadot/util/types';

export function useBattleMessage() {
  const { battle } = useBattle();
  return useSendMessage(battle?.programId as HexString, battle?.meta);
}
