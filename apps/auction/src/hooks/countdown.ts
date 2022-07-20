import { MULTIPLIER } from 'consts';
import { useState, useEffect, useRef } from 'react';
import { getCountdown } from 'utils';

function useCountdown(initTimeLeft: number, initPrice: number, rate: number) {
  const [timeLeft, setTimeLeft] = useState(initTimeLeft);
  const [price, setPrice] = useState(initPrice);
  const intervalId = useRef<NodeJS.Timer>();

  const handleCountdown = () => {
    setTimeLeft((prevTime) => prevTime - MULTIPLIER.MILLISECONDS);
    setPrice((prevPrice) => prevPrice - rate);
  };

  useEffect(() => {
    if (!intervalId.current && timeLeft) {
      intervalId.current = setInterval(handleCountdown, MULTIPLIER.MILLISECONDS);
    }

    return () => {
      if (intervalId.current && timeLeft === MULTIPLIER.MILLISECONDS) clearInterval(intervalId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  return { ...getCountdown(timeLeft), price };
}

export { useCountdown };
