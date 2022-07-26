import { MULTIPLIER } from 'consts';
import { useState, useEffect, useRef } from 'react';
import { getCountdown } from 'utils';

function useCountdown(initTimeLeft: number, initPrice: number, rate: number, onReset: () => void, onSet: () => void) {
  const [timeLeft, setTimeLeft] = useState(initTimeLeft);
  const [price, setPrice] = useState(initPrice);
  const intervalId = useRef<NodeJS.Timer>();

  const handleCountdown = () => {
    setTimeLeft((prevTime) => prevTime - MULTIPLIER.MILLISECONDS);
    setPrice((prevPrice) => prevPrice - rate);
  };

  const resetInterval = () => {
    clearInterval(intervalId.current);
    intervalId.current = undefined;
    onReset();
  };

  useEffect(() => {
    if (!intervalId.current && timeLeft) {
      // TODO: seems like a hacky solution, prolly there's another workaround
      // strict mode runs useEffect twice
      // -> onReset() (setStatus) is fired after first useEffect call
      // -> another component (without useCountdown hook) is rendered
      // -> useEffect will fire second time, but status already changed, therefore we need to set it again with onSet()
      onSet();
      intervalId.current = setInterval(handleCountdown, MULTIPLIER.MILLISECONDS);
    }

    return () => {
      if (intervalId.current) resetInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (intervalId.current && timeLeft === MULTIPLIER.MILLISECONDS) resetInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  return { ...getCountdown(timeLeft), price };
}

export { useCountdown };
