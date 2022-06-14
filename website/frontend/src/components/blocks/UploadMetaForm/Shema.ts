import * as yup from 'yup';

export const Schema = yup.object().shape({
  name: yup.string(),
});
