import * as yup from 'yup';
import { Metadata } from '@gear-js/api';

export const getValidationSchema = (type?: string, metadata?: Metadata) =>
  yup.object().shape({
    value: yup.number().required('This field is required').min(0, 'Initial value should be more  or equal than 0'),
    // @ts-ignore
    payload: yup.mixed().default('').testPayload(type, metadata),
    gasLimit: yup.number().min(0, 'Initial value should be more than 0'),
    payloadType: yup.string().required('Field with payload type must be filled'),
    destination: yup.string().required('Field with address must be filled'),
  });
