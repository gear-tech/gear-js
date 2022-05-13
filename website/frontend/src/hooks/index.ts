import { useContext } from 'react';
import { ApiContext, AccountContext, BlocksContext, EditorContext, LoadingContext } from 'context';
import { useEvents } from './useEvents';
import { useOutsideClick } from './useOutsideClick';
import { useBodyScrollLock } from './useBodyScrollLock';
import { useSubscription } from './useSubscription';
import { useChangeEffect } from "./useChangeEffect"
import { useProgram } from "./useProgram"

const useApi = () => useContext(ApiContext);
const useBlocks = () => useContext(BlocksContext);
const useAccount = () => useContext(AccountContext);
const useEditor = () => useContext(EditorContext);
const useLoading = () => useContext(LoadingContext);

export {
  useApi,
  useBlocks,
  useAccount,
  useEditor,
  useLoading,
  useEvents,
  useProgram,
  useOutsideClick,
  useChangeEffect,
  useBodyScrollLock,
  useSubscription,
};
