import { useRef, useState, MouseEvent, Ref, useImperativeHandle } from 'react';

import clearLight from '../assets/images/clear-light.svg?react';
import clear from '../assets/images/clear.svg?react';

function useClearButton<T extends HTMLInputElement | HTMLTextAreaElement>(
  forwardedRef: Ref<T> | undefined,
  color: string,
) {
  const inputRef = useRef<T>(null);

  // @ts-expect-error - TODO(#1738): figure out what's wrong
  useImperativeHandle(forwardedRef, () => inputRef.current);

  const [isVisible, setIsVisible] = useState(false);
  const icon = color === 'light' ? clearLight : clear;

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  const handleClick = () => {
    if (!window || !inputRef.current) return;

    const isTextarea = inputRef.current instanceof HTMLTextAreaElement;
    const prototype = isTextarea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;

    Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(inputRef.current, '');

    const changeEvent = new Event('change', { bubbles: true });
    inputRef.current.dispatchEvent(changeEvent);
  };

  const preventBlur = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();

  const clearButton = { isVisible, icon, show, hide, handleClick, preventBlur };

  return { clearButton, inputRef };
}

export { useClearButton };
