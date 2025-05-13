export function assert(value: boolean, msg: string) {
  if (!value) {
    throw new Error(msg);
  }
}
