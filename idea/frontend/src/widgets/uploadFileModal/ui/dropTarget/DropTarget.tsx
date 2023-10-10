import { useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isActive = canDrop && isOver;

  return (
    <CSSTransition in={isActive} timeout={AnimationTimeout.Default}>
      <div ref={drop} className={styles.dropTarget}>
        <p className={styles.message}>Or drag and drop your .wasm files here</p>
      </div>
    </CSSTransition>
  );
};

export { DropTarget };
