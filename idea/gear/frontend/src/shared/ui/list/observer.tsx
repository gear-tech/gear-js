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
    });

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onIntersection]);

  // height monkey patch to make it work with simplebar
  return <span ref={observerRef} style={{ display: 'block', height: '1px' }} />;
};

export { Observer };
