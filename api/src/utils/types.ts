export function transformTypes(types: object): { [key: string]: any } {
  return Object.values(types).reduce((res, types): object => ({ ...res, ...types }), {});
}
