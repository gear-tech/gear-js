import { ILike } from 'typeorm';

const transformForSqlLike = (query: string) => query.replace('%', '\\%').replace('_', '\\_');

export function sqlWhereWithILike(
  strictParams: { [key: string]: string },
  query: string | null | undefined,
  searchParams: string[],
) {
  const sqlQueryLikeTerm = query && ILike(`%${transformForSqlLike(query)}%`);

  if (sqlQueryLikeTerm) {
    return searchParams.map((param) => {
      const result: { [key: string]: any } = { ...strictParams };
      result[param] = sqlQueryLikeTerm;
      return result;
    });
  } else {
    return strictParams;
  }
}
