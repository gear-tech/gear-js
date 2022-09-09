export interface MessageDispatchedDataInput {
  statuses: { [key: string]: 'Success' | 'Failed' };
  blockHash: string;
  timestamp: number;
  genesis: string;
}
