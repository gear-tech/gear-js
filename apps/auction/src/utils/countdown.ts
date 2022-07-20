import { MULTIPLIER } from 'consts';

const getDoubleDigit = (value: number) => String(value).padStart(2, '0');
const getCountdownValue = (value: number) => getDoubleDigit(Math.floor(value));

const getCountdown = (delta: number) => {
  const { MILLISECONDS: MS, SECONDS: S, MINUTES: M } = MULTIPLIER;

  const hours = getCountdownValue(delta / (MS * S * M));
  const minutes = getCountdownValue((delta / (MS * S)) % M);
  const seconds = getCountdownValue((delta / MS) % S);

  return { hours, minutes, seconds };
};

export { getCountdown };
