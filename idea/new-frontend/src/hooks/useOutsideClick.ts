import { useEffect, useRef } from 'react';

const useOutsideClick = <TElement extends Element>(callback: () => void, isActive = true) => {
  const ref = useRef<TElement>(null);

  const handleClick = (event: MouseEvent) => {
    if (ref.current) {
      // https://github.com/JedWatson/react-select/issues/4560
      // @ts-ignore
      const isElementClicked = event.path.includes(ref.current);

      if (!isElementClicked) {
        callback();
      }
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
