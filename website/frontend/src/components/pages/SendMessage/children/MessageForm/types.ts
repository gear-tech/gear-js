export type InitialValues = {
  gasLimit: number;
  value: number;
  payload: string;
  destination: string;
  fields: {};
};

export type SetFieldValue = (field: string, value: any, shouldValidate?: boolean | undefined) => void;
