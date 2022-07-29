import * as yup from 'yup';
import { Metadata } from '@gear-js/api';

export const getValidationSchema = (deposit: number, type?: string, metadata?: Metadata) =>
  yup.object().shape({
    value: yup
      .number()
      .required('This field is required')
      .min(0, `Initial value should be more ${deposit} or equal than 0`)
      .moreThan(deposit, `Initial value should be more ${deposit} or equal than 0`),
    // @ts-ignore
    payload: yup.mixed().default('').testPayload(type, metadata),
    gasLimit: yup.number().required('This field is required').min(1, 'Gas limit should be more than 0'),
    programName: yup.string().max(50, 'Name value should be less than 50'),
    payloadType: yup.string().required('This field is required'),
  });
