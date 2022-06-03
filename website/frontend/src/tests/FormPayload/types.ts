import { FormPayloadValues, PayloadValue } from 'components/common/FormPayload/types';

export type FormValues = {
  payload: PayloadValue;
};

export type TestFormProps = {
  values?: FormPayloadValues;
  onSubmit: (values: FormValues) => void;
};
