import { useContext } from 'react';
import { ApiContext } from 'context/api';
import { BlocksContext } from 'context/blocks';
import { AccountContext } from 'context/account';
import { useEvents } from './useEvents';
import { useOutsideClick } from './useOutsideClick';
import { useBodyScrollLock } from './useBodyScrollLock';
import { useSubscription } from './useSubscription';

const useApi = () => useContext(ApiContext);
const useBlocks = () => useContext(BlocksContext);
const useAccount = () => useContext(AccountContext);

export { useApi, useBlocks, useAccount, useEvents, useOutsideClick, useBodyScrollLock, useSubscription };
