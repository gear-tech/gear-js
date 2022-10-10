export function getPayloadAndValue(args: any, method: string): [string, string] {
  const [payloadIndex, valueIndex] = ['sendMessage', 'sendReply'].includes(method) ? [1, 3] : [2, 4];

  const payload = args[payloadIndex].toHuman() as string;
  const value = args[valueIndex].toHuman() as string;

  return [payload, value];
}
