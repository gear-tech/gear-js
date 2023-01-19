import type { Hex } from '@gear-js/api';
import { useSendMessage } from '@gear-js/react-hooks';
import { useLesson } from '../context';

export function useTokensMessage() {
  const { lesson, meta } = useLesson();
  return useSendMessage(lesson?.programId as Hex, meta);
}

// todo: meta.txt for token metadata
// todo: payload - Message {
//   transaction_id: u32,
//     Mint {
//     recipient: -адрес тамагочи,
//       amount: 2000,
//   }.encode()
// }
