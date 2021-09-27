import * as yup from 'yup';

export const Schema = yup.object().shape({
  expectedType: yup.string(),
  incomingType: yup.string(),
});
