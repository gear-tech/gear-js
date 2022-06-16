import * as yup from 'yup';

export const Schema = yup.object().shape({
  name: yup.string().max(50, 'Name value should be less than 50'),
});
