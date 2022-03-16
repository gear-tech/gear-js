export type InitialValues = {
  gasLimit: number;
  value: number;
  payload: string;
  addressId: string;
  fields: {};
};

export type SendMessage = {
  addressId: string;
  value: string;
  gasLimit: string;
  payload: object;
};
