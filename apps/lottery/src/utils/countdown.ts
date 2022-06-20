import { MULTIPLIER } from 'consts';

const getDoubleDigit = (value: number) => `0${value}`.slice(-2);
const getCountdownValue = (value: number) => getDoubleDigit(Math.floor(value));

const getCountdown = (endTime: number) => {
  const { MILLISECONDS: MS, SECONDS: S, MINUTES: M, HOURS: H } = MULTIPLIER;
  const period = endTime - Date.now();

  const hours = getCountdownValue((period % (MS * S * M * H)) / (MS * S * M));
  const minutes = getCountdownValue((period % (MS * S * M)) / (MS * S));
  const seconds = getCountdownValue((period % (MS * S)) / MS);

  return `${hours}:${minutes}:${seconds}`;
};

export { getCountdown };
