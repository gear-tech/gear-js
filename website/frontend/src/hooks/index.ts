import { useContext } from 'react';
import { ApiContext } from 'context/api';
import { useBlocks } from './useBlocks';
import { useEvents } from './useEvents';
import { useOutsideClick } from './useOutsideClick';
import { useBodyScrollLock } from './useBodyScrollLock';
import { useSubscription } from './useSubscription';

const useApi = () => useContext(ApiContext);

export { useApi, useBlocks, useEvents, useOutsideClick, useBodyScrollLock, useSubscription };
