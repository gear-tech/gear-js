export function getPayloadAndValue(args: any, method: string): [string, string] {
  const [payloadIndex, valueIndex] = ['sendMessage', 'sendReply'].includes(method) ? [1, 3] : [2, 4];

  const payload = args[payloadIndex].toHex() as string;
  const value = args[valueIndex].toString() as string;

  return [payload, value];
}
