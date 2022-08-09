import { ReactNode, useMemo } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { Hex, Metadata } from '@gear-js/api';

import { getValidationSchema } from './Schema';
import { INITIAL_VALUES } from './const';
import { FormValues, SetFieldValue, RenderButtonsProps } from './types';

import { GasMethod } from 'consts';
import { useSendMessage, useGasCalculate } from 'hooks';
import {
  FormText,
  FormInput,
  FormPayload,
  FormPayloadType,
  FormNumberFormat,
  formStyles,
} from 'components/common/Form';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';

type Props = {
  id: string;
  isReply?: boolean;
  metadata?: Metadata;
  renderButtons: (props: RenderButtonsProps) => ReactNode;
};

const MessageForm = (props: Props) => {
  const { id, isReply = false, metadata, renderButtons } = props;

  const method = isReply ? GasMethod.Reply : GasMethod.Handle;
  const encodeType = isReply ? metadata?.async_handle_input : metadata?.handle_input;

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  const validationSchema = useMemo(() => getValidationSchema(encodeType, metadata), [metadata, encodeType]);

  const sendMessage = useSendMessage();
  const calculateGas = useGasCalculate();

  const handleSubmit = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const payloadType = metadata ? void 0 : values.payloadType;

    const message = {
      value: values.value.toString(),
      payload: getSubmitPayload(values.payload),
      gasLimit: values.gasLimit.toString(),
      replyToId: id as Hex,
      destination: id as Hex,
    };

    const callback = () => {
      const { payload } = payloadFormValues ?? INITIAL_VALUES;

      helpers.resetForm({
        values: {
          ...INITIAL_VALUES,
          payload,
        },
      });
    };

    sendMessage(method, message, callback, metadata, payloadType).catch(() => helpers.setSubmitting(false));
  };

  const handleCalculateGas = (values: FormValues, setFieldValue: SetFieldValue) => () =>
    calculateGas(method, values, null, metadata, id).then((gasLimit) => setFieldValue('gasLimit', gasLimit));

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validateOnChange={false}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid, isSubmitting, setFieldValue }) => {
        const isDisabled = !isValid || isSubmitting;

        return (
          <Form data-testid="sendMessageForm" className={formStyles.largeForm}>
            <FormText label={isReply ? 'Message Id' : 'Destination'} text={id} />

            <FormPayload name="payload" label="Payload" values={payloadFormValues} />

            {!metadata && <FormPayloadType name="payloadType" label="Payload type" />}

            <FormNumberFormat
              name="gasLimit"
              label="Gas limit"
              placeholder="1,000,000,000"
              thousandSeparator
              allowNegative={false}
            />

            <FormInput type="number" name="value" label="Value" placeholder="20000" />

            <div className={formStyles.formButtons}>
              {renderButtons({ isDisabled, calculateGas: handleCalculateGas(values, setFieldValue) })}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export { MessageForm };
