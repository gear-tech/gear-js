export function getPayloadAndValueAndReplyToId(args: any, method: string): [string, string, string | null] {
  const [payloadIndex, valueIndex] = ['sendMessage', 'sendReply'].includes(method) ? [1, 3] : [2, 4];

  const payload = args[payloadIndex].toHex() as string;
  const value = args[valueIndex].toString() as string;

  const replyToId = method === 'sendReply' ? args[0].toHex() : null;

  return [payload, value, replyToId];
}
