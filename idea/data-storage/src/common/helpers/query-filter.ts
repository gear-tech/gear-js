import { In } from 'typeorm';

export function queryFilter(
  strictParams: {[key: string]: string},
  queryParams: {[key: string]: string | string[]},
  searchParams: string[]
): Record<string, unknown>[]{
  let queryBodyList:Record<string, unknown>[] = [];
  const { query, ...queryParamsWithoutSearch } = queryParams;

  const isIncludeSearch = query && query.length > 0;
  const isIncludeQueryParams = Object.keys(queryParamsWithoutSearch).length >= 1;

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
  } else {
    queryBodyList = [queryBody];
  }


  if(isIncludeSearch) {
    for(const param of searchParams){
      const queryBody: {[key: string]: unknown} = { ...strictParams };

      queryBody[param] = query;
      queryBodyList = [...queryBodyList, queryBody];
    }
  }

  return queryBodyList;
}
