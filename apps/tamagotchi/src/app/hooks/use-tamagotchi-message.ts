import { useSendMessage } from '@gear-js/react-hooks';
import { useLesson } from '../context';
import { HexString } from '@polkadot/util/types';

export function useTamagocthiMessage() {
  const { lesson, meta } = useLesson();
  return useSendMessage(lesson?.programId as HexString, meta);
}
