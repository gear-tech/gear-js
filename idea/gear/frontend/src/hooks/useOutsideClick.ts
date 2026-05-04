import { useEffect, useRef } from 'react';

const useOutsideClick = <TElement extends Element>(callback: (event: MouseEvent) => void, isActive = true) => {
  const ref = useRef<TElement>(null);

  const handleClick = (event: MouseEvent) => {
    const isOutsideClick = ref.current && !ref.current.contains(event.target as Node);

    if (isOutsideClick) callback(event);
  };

  useEffect(() => {
    if (!isActive) return;

    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, [isActive]);

  return ref;
};

export { useOutsideClick };
