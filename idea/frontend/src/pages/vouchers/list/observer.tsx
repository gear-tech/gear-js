import { useEffect, useRef } from 'react';

type Props = {
  onIntersection: () => void;
};

const Observer = ({ onIntersection }: Props) => {
  const observerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (!isIntersecting) return;

      onIntersection();
      console.log('fetch');
    });

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onIntersection]);

  return <span ref={observerRef} />;
};

export { Observer };
