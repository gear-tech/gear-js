import * as yup from 'yup';

export const Schema = yup.object().shape({
  value: yup.number().required('This field is required').min(0, 'Initial value should be more  or equal than 0'),
  gasLimit: yup.number().min(0, 'Initial value should be more than 0'),
  payloadType: yup.string().required('Field with payload type must be filled'),
  destination: yup.string().required('Field with address must be filled'),
});
