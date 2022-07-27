/* eslint-disable import/no-cycle */
import { useContext } from 'react';
import { BlocksContext, EditorContext } from 'context';

const useBlocks = () => useContext(BlocksContext);
const useEditor = () => useContext(EditorContext);

export { useBlocks, useEditor };
export { useEvents } from './useEvents';
export { useOutsideClick } from './useOutsideClick';
export { useSubscription } from './useSubscription';
export { useChangeEffect } from './useChangeEffect';
export { useProgram } from './useProgram';
export { useCodeUpload } from './useCodeUpload';
export { useSendMessage } from './useMessageSend';
export { useProgramUpload } from './useProgramUplaod';
export { useMessageClaim } from './useMessageClaim';
export { useBalanceTransfer } from './useBalanceTransfer';
export { useAccountSubscriptions } from './useAccountSubscriptions';
export { useSidebarNodes } from './useSidebarNodes';
export { useGasCalculate } from './useGasCalculate';
