import * as yup from 'yup';
import { Metadata } from '@gear-js/api';

export const getValidationSchema = (type?: string, metadata?: Metadata) =>
  yup.object().shape({
    // @ts-ignore
    payload: yup.mixed().default('').testPayload(type, metadata),
  });
