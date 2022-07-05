/* eslint-disable import/no-cycle */
import { useContext } from 'react';
import { BlocksContext, EditorContext } from 'context';
import { useEvents } from './useEvents';
import { useOutsideClick } from './useOutsideClick';
import { useBodyScrollLock } from './useBodyScrollLock';
import { useSubscription } from './useSubscription';
import { useChangeEffect } from './useChangeEffect';
import { useProgram } from './useProgram';
import { useCodeUpload } from './useCodeUpload';
import { useSendMessage } from './useMessageSend';
import { useProgramUpload } from './useProgramUplaod';
import { useClaimMessage } from './useClaimMessage';
import { useAccountSubscriptions } from './useAccountSubscriptions';

const useBlocks = () => useContext(BlocksContext);
const useEditor = () => useContext(EditorContext);

export {
  useBlocks,
  useEditor,
  useEvents,
  useProgram,
  useCodeUpload,
  useSendMessage,
  useProgramUpload,
  useClaimMessage,
  useOutsideClick,
  useChangeEffect,
  useBodyScrollLock,
  useSubscription,
  useAccountSubscriptions,
};
