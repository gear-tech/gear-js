import { string, number, object } from 'yup';

import { payloadSchema } from 'components/common/Form/FormPayload/Schema';

export const Schema = object().shape({
  metaValues: object().shape({
    init_input: string(),
    init_output: string(),
    async_init_input: string(),
    async_init_output: string(),
    handle_input: string(),
    handle_output: string(),
    async_handle_input: string(),
    async_handle_output: string(),
    meta_state_input: string(),
    meta_state_output: string(),
    types: string(),
  }),
  programValues: object().shape({
    value: number().required('This field is required').min(0, 'Initial value should be more or equal than 0'),
    payload: payloadSchema,
    gasLimit: number().min(0, 'Initial value should be more than 0'),
    programName: string().max(50, 'Name value should be less than 50'),
  }),
});
