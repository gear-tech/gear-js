export function responseHasResult(response: undefined): boolean {
  return Object.keys(response).includes('result');
}
export function responseHasError(response: undefined): boolean {
  return Object.keys(response).includes('error');
}
