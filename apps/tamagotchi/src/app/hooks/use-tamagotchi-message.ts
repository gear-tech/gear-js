import { useContext } from 'react';
import type { Hex } from '@gear-js/api';
import { useSendMessage } from '@gear-js/react-hooks';
import { AppCtx } from '../context';
import { useLessonMetadata } from './use-lesson-metadata';

export function useTamagocthiMessage() {
  const { lesson } = useContext(AppCtx);
  const { metadata } = useLessonMetadata();
  return useSendMessage(lesson?.programId as Hex, metadata);
}
