import { useRef, useEffect } from 'react';
import throttle from 'lodash.throttle';

const OFFSET = 80;

// eslint-disable-next-line @typescript-eslint/default-param-last
const useScrollLoader = <T extends HTMLElement>(callback = () => {}, hasMore: boolean) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    let isCalled = false;
    const target = ref.current;

    const handleScroll = throttle((event: Event) => {
      // @ts-ignore
      const { scrollHeight, offsetHeight, scrollTop } = event.target;

      const loadMore = scrollTop + offsetHeight + OFFSET >= scrollHeight;

      if (hasMore && loadMore && !isCalled) {
        isCalled = true;
        callback();
      }
    }, 100);

    target?.addEventListener('scroll', handleScroll);

    return () => {
      target?.removeEventListener('scroll', handleScroll);
    };
  }, [callback, hasMore]);

  return ref;
};

export { useScrollLoader };
