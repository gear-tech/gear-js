import { useRef, CSSProperties } from 'react';

const useElementSizes = <T extends HTMLElement>() => {
  const elementRef = useRef<T>(null);

  const element = elementRef.current;

  const elementStyles = { '--offset-height': `${element?.offsetHeight || 0}px` } as CSSProperties;

  return { elementRef, elementStyles };
};

export { useElementSizes };
