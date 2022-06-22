import { STATUS } from 'consts';

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

export { getStatus };
