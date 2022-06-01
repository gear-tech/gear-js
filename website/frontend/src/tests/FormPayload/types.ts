import { FormPayloadValues, PayloadTypeStructures } from 'components/common/FormPayload/types';

export type FormValues = {
  payload: FormPayloadValues;
};

export type TestFormProps = {
  typeStructures?: PayloadTypeStructures;
  onSubmit: (values: FormValues) => void;
};
