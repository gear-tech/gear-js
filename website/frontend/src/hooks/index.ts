import { useContext } from 'react';
import { ApiContext } from 'context/api';
import { BlocksContext } from 'context/blocks';
import { useEvents } from './useEvents';
import { useOutsideClick } from './useOutsideClick';
import { useBodyScrollLock } from './useBodyScrollLock';
import { useSubscription } from './useSubscription';

const useApi = () => useContext(ApiContext);
const useBlocks = () => useContext(BlocksContext);

export { useApi, useBlocks, useEvents, useOutsideClick, useBodyScrollLock, useSubscription };
