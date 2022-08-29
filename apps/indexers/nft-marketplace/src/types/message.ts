export interface IMessage {
  id: string;
  source: string;
  destination: string;
  payload: string;
  value: string;
  reply: {
    exitCode: number;
    replyTo: string;
  };
}
