import { TIME } from 'consts';

export const getTime = (time: number) => {
  let years = 0;
  let months = 0;
  let days = 0;
  let hours = 0;
  let minutes = 0;

  if (time > 0) {
    let remainder = time;

    years = Math.trunc(remainder / TIME.YEAR);
    remainder %= TIME.YEAR;
    months = Math.trunc(remainder / TIME.MONTH);
    remainder %= TIME.MONTH;
    days = Math.trunc(remainder / TIME.DAY);
    remainder %= TIME.DAY;
    hours = Math.trunc(remainder / TIME.HOUR);
    remainder %= TIME.HOUR;
    minutes = Math.ceil(remainder / TIME.MINUTE);
  }

  return { years, months, days, hours, minutes };
};
