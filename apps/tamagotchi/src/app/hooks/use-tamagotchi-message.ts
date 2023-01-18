import { useContext } from 'react';
import type { Hex } from '@gear-js/api';
import { useSendMessage } from '@gear-js/react-hooks';
import { TmgContext } from '../context';
import { useLessonMetadata } from './use-lesson-metadata';

export function useTamagocthiMessage() {
  const { state } = useContext(TmgContext);
  const { metadata } = useLessonMetadata();
  return useSendMessage(state?.programId as Hex, metadata);
}
