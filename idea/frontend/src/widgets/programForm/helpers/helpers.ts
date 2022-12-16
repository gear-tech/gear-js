import * as yup from 'yup';

import { PayloadSchemaParams } from 'entities/formPayload';

const getValidationSchema = ({ deposit, maxGasLimit }: PayloadSchemaParams) =>
  yup.object().shape({
    value: yup
      .number()
      .required('This field is required')
      .test(
        'min',
        `Initial value should be more ${deposit} or equal than 0`,
        (value = 0) => value === 0 || value > deposit,
      ),
    // @ts-ignore
    // commented cuz otherwise react-final-form crashes on certain types of payloads
    // payload: yup.mixed().default('').testPayload(type, metadata),
    gasLimit: yup
      .number()
      .required('This field is required')
      .min(0, 'Gas limit should be more or equal than 0')
      .max(maxGasLimit, `Gas limit should be less than ${maxGasLimit}`),
    programName: yup.string().max(50, 'Name value should be less than 50'),
    payloadType: yup.string().required('This field is required'),
  });

export { getValidationSchema };
