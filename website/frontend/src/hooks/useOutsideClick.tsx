import { useEffect, useRef } from 'react';

function useOutsideClick(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

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
