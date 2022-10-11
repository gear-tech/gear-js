import { Between, In } from 'typeorm';

export function queryFilter(
  strictParams: {[key: string]: string},
  queryParams: {[key: string]: string | string[]},
  searchParams: string[]
): Record<string, unknown>[] | Record<string, unknown> {
  let queryBodyList:Record<string, unknown>[] = [];
  const { query, fromDate, toDate, ...queryParamsWithoutSearch } = queryParams;

  const isIncludeSearchByTitle = query && query.length > 0;
  const isIncludeQueryParams = Object.keys(queryParamsWithoutSearch).length >= 1
    && Object.values(queryParamsWithoutSearch).filter(Boolean).length >= 1;
  const isIncludeSearchByDates = fromDate && toDate;

  const queryBody: {[key: string]: unknown} = { ...strictParams };

  if(isIncludeQueryParams) {
    for(const queryKey in queryParamsWithoutSearch) {
      const queryValue = queryParams[queryKey];

      if(Array.isArray(queryValue)) {
        queryBody[queryKey] = In(queryValue);
      } else {
        queryBody[queryKey] = queryValue;
      }
    }
  }

  if(isIncludeSearchByDates) {
    const from = fromDate as string;
    const to = toDate as string;

    queryBody['timestamp'] = Between(
      new Date(from),
      new Date(to)
    );
  }

  if(isIncludeSearchByTitle) {
    for(const param of searchParams){
      const queryBody: {[key: string]: unknown} = { ...strictParams };

      queryBody[param] = query;
      queryBodyList = [...queryBodyList, queryBody];
    }
  }

  if(queryBodyList.length === 0) {
    return queryBody;
  }

  return queryBodyList;
}
