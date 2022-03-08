export type InitialValues = {
  gasLimit: number;
  value: number;
  payload: string;
  messageId: string;
  fields: {};
};

export type ReplyType = {
  messageId: string;
  value: number;
  gasLimit: number;
  payload: object;
};
