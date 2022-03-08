import { useContext } from 'react';
import { ApiContext } from 'context/api';
import { BlocksContext } from 'context/blocks';
import { AccountContext } from 'context/account';
import { EditorContext } from 'context/editor';
import { LoadingContext } from 'context/loading';
import { useEvents } from './useEvents';
import { useOutsideClick } from './useOutsideClick';
import { useBodyScrollLock } from './useBodyScrollLock';
import { useSubscription } from './useSubscription';

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
  useOutsideClick,
  useBodyScrollLock,
  useSubscription,
};
