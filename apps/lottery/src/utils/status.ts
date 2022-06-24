import { STATUS, MULTIPLIER } from 'consts';

const getDoubleDigit = (value: number) => String(value).padStart(2, '0');
const getCountdownValue = (value: number) => getDoubleDigit(Math.floor(value));

const getCountdown = (endTime: number) => {
  const { MILLISECONDS: MS, SECONDS: S, MINUTES: M } = MULTIPLIER;
  const delta = endTime - Date.now();

  const hours = getCountdownValue(delta / (MS * S * M));
  const minutes = getCountdownValue((delta / (MS * S)) % M);
  const seconds = getCountdownValue((delta / MS) % S);

  return delta > 0 ? `${hours}h : ${minutes}m : ${seconds}s` : '';
};

const getStatus = (endTime: number) => {
  const currentTime = Date.now();

  if (endTime) {
    if (currentTime > endTime) {
      return STATUS.FINISHED;
    }

    return STATUS.PENDING;
  }

  return STATUS.AWAIT;
};

export { getCountdown, getStatus };
