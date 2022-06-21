import { string, number, object } from 'yup';

import { payloadSchema } from 'components/common/Form/FormPayload/Schema';

export const Schema = object().shape({
  value: number().required('This field is required').min(0, 'Initial value should be more or equal than 0'),
  payload: payloadSchema,
  gasLimit: number().min(0, 'Initial value should be more than 0'),
  programName: string().max(50, 'Name value should be less than 50'),
  payloadType: string().required('Field with payload type must be filled'),
});
