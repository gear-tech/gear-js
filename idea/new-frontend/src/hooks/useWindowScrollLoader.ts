import { useEffect } from 'react';
import throttle from 'lodash.throttle';

const useWindowScrollLoader = (callback: () => void, hasMore: boolean) => {
  useEffect(() => {
    const handleScroll = throttle(() => {
      const loadMore = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight;

      if (hasMore && loadMore) callback();
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [callback, hasMore]);
};

export { useWindowScrollLoader };
