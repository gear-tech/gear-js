import * as Yup from 'yup';

export const Schema = Yup.object({
  password: Yup.string().required('Password is required'),
});
