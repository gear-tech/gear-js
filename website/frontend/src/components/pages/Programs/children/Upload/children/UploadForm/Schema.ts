import * as yup from 'yup';

export const Schema = yup.object().shape({
  metaValues: yup.object().shape({
    init_input: yup.string(),
    init_output: yup.string(),
    async_init_input: yup.string(),
    async_init_output: yup.string(),
    handle_input: yup.string(),
    handle_output: yup.string(),
    async_handle_input: yup.string(),
    async_handle_output: yup.string(),
    meta_state_input: yup.string(),
    meta_state_output: yup.string(),
    types: yup.string(),
  }),
  programValues: yup.object().shape({
    programName: yup.string().max(50, 'Name value should be less than 50'),
    gasLimit: yup.number().min(0, 'Initial value should be more than 0'),
    value: yup.number().required('This field is required').min(0, 'Initial value should be more or equal than 0'),
  }),
});
