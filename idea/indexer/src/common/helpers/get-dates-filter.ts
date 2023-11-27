export function getDatesFilter(fromDate: string, toDate: string) {
  if (fromDate && toDate) {
    return { fromDate, toDate };
  }
  if (fromDate) {
    return { fromDate };
  }
  if (toDate) {
    return { toDate };
  }
  return undefined;
}
