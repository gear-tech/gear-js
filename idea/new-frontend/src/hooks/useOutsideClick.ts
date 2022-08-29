import { useEffect, useRef } from 'react';

const useOutsideClick = <TElement extends Element>(callback: () => void, isActive = true) => {
  const ref = useRef<TElement>(null);

  const handleClick = ({ target }: MouseEvent) => {
    const isElementClicked = ref.current?.contains(target as Node);

    if (!isElementClicked) {
      callback();
    }
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return ref;
};

export { useOutsideClick };
