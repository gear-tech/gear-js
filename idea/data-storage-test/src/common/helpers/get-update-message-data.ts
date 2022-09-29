export function getUpdateMessageData(args: any, method: string): [string, string] {
  const indexPayload = ['sendMessage', 'sendReply'].includes(method) ? 1 : 2;
  const indexValue = indexPayload + 2;

  const payload = args[indexPayload].toHuman() as string;
  const value = args[indexValue].toHuman() as string;

  return [payload, value];
}
