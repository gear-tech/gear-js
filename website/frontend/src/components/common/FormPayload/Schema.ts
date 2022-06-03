import { lazy, string, object } from 'yup';

export const payloadSchema = lazy((value) => {
  if (typeof value === 'object') {
    return object();
  }

  return string().required('This field is required');
});
