import { useRef, CSSProperties } from 'react';

const useElementSizes = <T extends HTMLElement>() => {
  const elementRef = useRef<T>(null);

  const element = elementRef.current;

  const clientHeight = element?.clientHeight ?? 0;
  const offsetHeight = element?.offsetHeight ?? 0;

  const elementStyles = {
    '--offset-height': `${offsetHeight}px`,
    '--client-height': `${clientHeight}px`,
  } as CSSProperties;

  return { elementRef, elementStyles, clientHeight, offsetHeight };
};

export { useElementSizes };
