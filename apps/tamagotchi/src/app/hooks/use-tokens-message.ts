import { useContext } from 'react';
import type { Hex } from '@gear-js/api';
import { useSendMessage } from '@gear-js/react-hooks';
import { TmgContext } from '../context';
import { useLessonMetadata } from './use-lesson-metadata';

export function useTokensMessage() {
  const { state } = useContext(TmgContext);
  const { metadata } = useLessonMetadata();
  return useSendMessage(state?.programId as Hex, metadata);
}

// todo: meta.txt for token metadata
// todo: payload - Message {
//   transaction_id: u32,
//     Mint {
//     recipient: -адрес тамагочи,
//       amount: 2000,
//   }.encode()
// }
