import { useEffect, useRef } from 'react';
import { EditorTypes } from '../../../types/editor';

type Props = {
  type: EditorTypes;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  value?: string;
};

export const EditorTreeInput = ({ type, value, onCancel, onSubmit }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current!.focus();
    inputRef.current!.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        // @ts-ignore
        onSubmit(event.target.value);
      }
      if (event.key === 'Escape') {
        onCancel();
      }
    });
  }, [inputRef, type, onCancel, onSubmit]);

  return <input type="text" className="tree-input" ref={inputRef} defaultValue={value} />;
};

EditorTreeInput.defaultProps = {
  value: '',
};
