import { FieldName } from './types';

export const getValidation = (balance: number) => ({
  [FieldName.Amount]: (value: number) => {
    if (+value > balance && balance !== 0) return `The value must be equal to or less than ${balance}`;

    if (+value <= 0) return 'The value must be greater than 0';

    return null;
  },
});
