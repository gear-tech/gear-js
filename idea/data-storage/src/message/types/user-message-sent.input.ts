export interface UserMessageSentInput {
  id: string;
  destination: string;
  source: string;
  payload?: string;
  value?: string;
  entry?: string;
  replyToMessageId?: string | null;
  exitCode?: number | null;
  expiration?: number | null;
  genesis: string;
  blockHash: string;
  timestamp: number;
}
