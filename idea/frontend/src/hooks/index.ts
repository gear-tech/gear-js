/* eslint-disable import/no-cycle */
import { useContext } from 'react';
import { BlocksContext, EditorContext, ModalContext } from 'context';

const useModal = () => useContext(ModalContext);
const useBlocks = () => useContext(BlocksContext);
const useEditor = () => useContext(EditorContext);

export { useBlocks, useEditor, useModal };
export { useEvents } from './useEvents';
export { useOutsideClick } from './useOutsideClick';
export { useSubscription } from './useSubscription';
export { useChangeEffect } from './useChangeEffect';
export { useProgram } from './useProgram';
export { useMessage } from './useMessage';
export { useCodeUpload } from './useCodeUpload';
export { useMessageClaim } from './useMessageClaim';
export { useProgramActions } from './useProgramActions';
export { useMetadataUpload } from './useMetadataUpload';
export { useBalanceTransfer } from './useBalanceTransfer';
export { useEventSubscriptions } from './useEventSubscriptions';
export { useSidebarNodes } from './useSidebarNodes';
export { useGasCalculate } from './useGasCalculate';
export { useStateRead } from './useStateRead';
