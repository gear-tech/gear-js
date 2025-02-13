import { useRef, useState, MouseEvent, Ref, useImperativeHandle } from 'react';
import { ReactComponent as clear } from '../assets/images/clear.svg';
import { ReactComponent as clearLight } from '../assets/images/clear-light.svg';

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

    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    valueSetter?.call(inputRef.current, '');

    const changeEvent = new Event('change', { bubbles: true });
    inputRef.current.dispatchEvent(changeEvent);
  };

  const preventBlur = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();

  const clearButton = { isVisible, icon, show, hide, handleClick, preventBlur };

  return { clearButton, inputRef };
}

export { useClearButton };
