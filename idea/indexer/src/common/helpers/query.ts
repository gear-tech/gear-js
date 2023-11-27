import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export function getDatesFilter(fromDate: string, toDate: string) {
  if (fromDate && toDate) {
    // return Between(new Date(fromDate), new Date(toDate));
    return { fromDate, toDate };
  }
  if (fromDate) {
    // return MoreThanOrEqual(new Date(fromDate));
    return { fromDate };
  }
  if (toDate) {
    // return LessThanOrEqual(new Date(toDate));
    return { toDate };
  }
  return undefined;
}
