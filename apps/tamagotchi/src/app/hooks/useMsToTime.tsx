import { useState, useEffect } from 'react';

type TimeType = { hours: string; minutes: string; seconds: string; timeWarning: boolean };

export const useMsToTime = (duration: string | undefined) => {
  const toNumberDuration: number = duration ? Number(duration.split(',').join('')) : 0;
  const countDuration = Date.now();

  const [counter, setCounter] = useState(toNumberDuration);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + countDuration - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [countDuration]);

  const getReturnValues = (timeLeft: number): TimeType => {
    const warningCheck = (hours: number, minutes: number, seconds: number): boolean =>
      !!hours && !!minutes && seconds > 20;

    const hoursTemp: number = Math.floor(timeLeft / 1000 / 60 / 60);
    const minutesTemp: number = Math.floor((timeLeft / 1000 / 60 / 60 - hoursTemp) * 60);
    const secondsTemp: number = Math.floor(((timeLeft / 1000 / 60 / 60 - hoursTemp) * 60 - minutesTemp) * 60);

    const timeLessTen = (time: number): string => (time > 0 ? `0${time.toString()}` : '00');

    const hours = hoursTemp >= 10 ? hoursTemp.toString() : timeLessTen(hoursTemp);
    const minutes = minutesTemp >= 10 ? minutesTemp.toString() : timeLessTen(minutesTemp);
    const seconds = secondsTemp >= 10 ? secondsTemp.toString() : timeLessTen(secondsTemp);
    const timeWarning = warningCheck(hoursTemp, minutesTemp, secondsTemp);
    return { hours, minutes, seconds, timeWarning };
  };

  return getReturnValues(counter);
};
