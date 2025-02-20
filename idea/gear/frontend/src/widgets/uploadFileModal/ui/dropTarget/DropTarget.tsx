import { useCallback, useRef } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { CSSTransition } from 'react-transition-group';

import { AnimationTimeout } from '@/shared/config';

import styles from './DropTarget.module.scss';

type Props = {
  onUpload: (file: File) => void;
};

const DropTarget = ({ onUpload }: Props) => {
  const handleFileDrop = useCallback(
    (item: { files: File[] }) => {
      const file = item.files?.[0];

      onUpload(file);
    },

    [onUpload],
  );

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop: handleFileDrop,
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [handleFileDrop],
  );

  // TODO(#1779): temporary react 19 patch
  const dropRef = useRef<HTMLDivElement>(null);
  drop(dropRef);

  const isActive = canDrop && isOver;

  return (
    // TODO(#1780): remove nodeRef prop
    <CSSTransition nodeRef={dropRef} in={isActive} timeout={AnimationTimeout.Default}>
      <div ref={dropRef} className={styles.dropTarget}>
        <p className={styles.message}>Or drag and drop your .wasm files here</p>
      </div>
    </CSSTransition>
  );
};

export { DropTarget };
