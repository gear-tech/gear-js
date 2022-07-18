import * as yup from 'yup';

export const Schema = yup.object().shape({
  destination: yup.string().required('This field is required'),
});
