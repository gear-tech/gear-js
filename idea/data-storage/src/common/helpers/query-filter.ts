import { Between, In } from 'typeorm';

export function queryFilter(
  strictParams: {[key: string]: string},
  queryParams: {[key: string]: string | string[]},
  searchParams: string[]
): Record<string, unknown>[]{
  let queryBodyList:Record<string, unknown>[] = [];
  const { query, ...queryParamsWithoutSearch } = queryParams;

  const isIncludeSearchByTitle = query && query.length > 0;
  const isIncludeQueryParams = Object.keys(queryParamsWithoutSearch).length >= 1;
  const isIncludeSearchByDates = ['fromDate', 'toDate'].every(key => Object.keys(queryParams).includes(key));

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
    const fromDate = queryParamsWithoutSearch['fromDate'] as string;
    const toDate = queryParamsWithoutSearch['toDate'] as string;

    queryBody['timestamp'] = Between(
      new Date(fromDate),
      new Date(toDate)
    );
  }

  if(isIncludeSearchByTitle) {
    for(const param of searchParams){
      const queryBody: {[key: string]: unknown} = { ...strictParams };

      queryBody[param] = query;
      queryBodyList = [...queryBodyList, queryBody];
    }
  }

  if(isIncludeQueryParams && !isIncludeSearchByTitle) {
    queryBodyList = [queryBody];
  }

  return queryBodyList;
}
