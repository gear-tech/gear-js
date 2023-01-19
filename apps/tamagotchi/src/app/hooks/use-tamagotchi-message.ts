import type { Hex } from '@gear-js/api';
import { useSendMessage } from '@gear-js/react-hooks';
import { useLesson } from '../context';

export function useTamagocthiMessage() {
  const { lesson, meta } = useLesson();
  return useSendMessage(lesson?.programId as Hex, meta);
}
