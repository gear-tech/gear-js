export type Mail = {
  destination: string;
  id: string;
  payload: string | object;
  reply: [];
  source: string;
  value: string;
};

export type Mails = {
  mails: Mail[];
};
