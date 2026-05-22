export const cacheKey = {
  messagesFromSource: (genesis: string, addr: string) => `messages_from:${genesis}:source:${addr}`,
  messagesToDestination: (genesis: string, addr: string) => `messages_to:${genesis}:destination:${addr}`,
  eventsSource: (genesis: string, addr: string) => `events:${genesis}:source:${addr}`,
  programData: (genesis: string, id: string) => `pdata:${genesis}:${id}`,
  programsVersion: (genesis: string) => `programs:${genesis}:version`,
  programsPage: (genesis: string, offset: number | string, limit: number | string) =>
    `programs:${genesis}:page:${offset}:limit:${limit}`,
};
