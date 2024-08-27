import { useEffect, useState } from 'react';

function useCountdown(value: number | undefined) {
  const [timeLeft, setTimeLeft] = useState<number>();

  useEffect(() => {
    if (value === undefined) return;

    const intervalId = setInterval(() => {
      const delta = value - Date.now();

      if (delta > 0) {
        setTimeLeft(delta);
      } else {
        setTimeLeft(0);
        clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [value]);

  return timeLeft;
}

export { useCountdown };
