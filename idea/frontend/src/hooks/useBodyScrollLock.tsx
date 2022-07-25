import { useEffect, useRef } from 'react';
import { lock, unlock } from 'tua-body-scroll-lock';

export function useBodyScrollLock<Type extends HTMLElement>(enabled = false) {
  const targetRef = useRef<Type>(null);

  useEffect(() => {
    const target = targetRef.current;

    if (target && enabled) {
      lock(target);
    }

    return () => {
      unlock(target);
    };
  }, [enabled]);

  return targetRef;
}
