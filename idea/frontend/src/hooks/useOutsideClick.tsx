import { useEffect, useRef } from 'react';

function useOutsideClick<TElement extends Element>(callback: () => void) {
  const ref = useRef<TElement>(null);

  const handleClick = ({ target }: MouseEvent) => {
    const isElementClicked = ref.current?.contains(target as Node);

    if (!isElementClicked) {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export { useOutsideClick };
