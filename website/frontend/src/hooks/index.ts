/* eslint-disable import/no-cycle */
import { useContext } from 'react';
import { ApiContext, AccountContext, AlertContext, BlocksContext, EditorContext } from 'context';
import { useEvents } from './useEvents';
import { useOutsideClick } from './useOutsideClick';
import { useBodyScrollLock } from './useBodyScrollLock';
import { useSubscription } from './useSubscription';
import { useChangeEffect } from './useChangeEffect';
import { useProgram } from './useProgram';
import { useCodeUpload } from './useCodeUpload';
import { useSendMessage } from './useMessageSend';
import { useProgramUpload } from './useProgramUplaod';
import { useLoggedInAccount } from './useLoggedInAccount';
import { useEventSubscriptions } from './useEventSubscriptions';

const useApi = () => useContext(ApiContext);
const useAlert = () => useContext(AlertContext);
const useBlocks = () => useContext(BlocksContext);
const useAccount = () => useContext(AccountContext);
const useEditor = () => useContext(EditorContext);

export {
  useApi,
  useAlert,
  useBlocks,
  useAccount,
  useEditor,
  useEvents,
  useProgram,
  useCodeUpload,
  useSendMessage,
  useProgramUpload,
  useOutsideClick,
  useChangeEffect,
  useBodyScrollLock,
  useSubscription,
  useLoggedInAccount,
  useEventSubscriptions,
};
