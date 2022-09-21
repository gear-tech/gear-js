import { Hex } from '@gear-js/api';
import { Button, Input } from '@gear-js/ui';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';

import sendSVG from 'shared/assets/images/actions/send.svg';
import closeSVG from 'shared/assets/images/actions/close.svg';
import { FormInput } from 'shared/ui/form';
import { Box } from 'shared/ui/box';
import { GasMethod } from 'shared/config';
import { getValidation } from 'shared/helpers';
import { GasField } from 'features/gasField';
import { FormPayload, getPayloadFormValues, getSubmitPayload } from 'features/formPayload';
import { useGasCalculate, useMessageActions, useProgram } from 'hooks';
import { Result } from 'hooks/useGasCalculate/types';

import { getValidationSchema, resetPayloadValue } from '../helpers';
import { FormValues, INITIAL_VALUES } from '../model';
import styles from './SendMessage.module.scss';

type Params = { programId: Hex };

const SendMessage = () => {
  const { programId } = useParams() as Params;
  const navigate = useNavigate();

  const { api } = useApi();
  const alert = useAlert();

  const { metadata, isLoading } = useProgram(programId, true);
  const calculateGas = useGasCalculate();
  const { sendMessage, replyMessage } = useMessageActions();

  const [isDisabled, setIsDisabled] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);
  const [gasInfo, setGasInfo] = useState<Result>();

  const formApi = useRef<FormApi<FormValues>>();

  const deposit = api.existentialDeposit.toNumber();
  const maxGasLimit = api.blockGasLimit.toNumber();
  const method = GasMethod.Handle;
  const encodeType = metadata?.handle_input;

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  const validation = useMemo(
    () => {
      const schema = getValidationSchema({ type: encodeType, deposit, metadata, maxGasLimit });

      return getValidation(schema);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadata, encodeType],
  );

  const disableSubmitButton = () => setIsDisabled(true);
  const enableSubmitButton = () => setIsDisabled(false);

  const resetForm = () => {
    if (!formApi.current) return;

    const { values } = formApi.current.getState();

    formApi.current.reset();
    formApi.current.change('payload', resetPayloadValue(values.payload));

    enableSubmitButton();
    setGasInfo(undefined);
  };

  const handleSubmitForm = (values: FormValues) => {
    disableSubmitButton();

    const payloadType = metadata ? undefined : values.payloadType;

    const commonValues = {
      value: values.value.toString(),
      payload: getSubmitPayload(values.payload),
      gasLimit: values.gasLimit.toString(),
    };

    // if (isReply) {
    //   const reply: IMessageSendReplyOptions = { ...commonValues, replyToId: id };
    //   replyMessage({ reply, metadata, payloadType, reject: finishSubmitting, resolve });
    // } else {
    const message = { ...commonValues, destination: programId };

    sendMessage({ message, metadata, payloadType, reject: enableSubmitButton, resolve: resetForm });
    // }
  };

  const handleGasCalculate = async () => {
    if (!formApi.current) return;

    setIsGasDisabled(true);

    const { values } = formApi.current.getState();
    const preparedValues = { ...values, payload: getSubmitPayload(values.payload) };

    try {
      const info = await calculateGas(method, preparedValues, null, metadata, programId);

      formApi.current.change('gasLimit', info.limit);
      setGasInfo(info);
    } catch (error) {
      const message = (error as Error).message;
      alert.error(message);
    } finally {
      setIsGasDisabled(false);
    }
  };

  const goBack = () => navigate(-1);

  return (
    <>
      <h2 className={styles.heading}>Send Message</h2>
      <Form validateOnBlur initialValues={INITIAL_VALUES} validate={validation} onSubmit={handleSubmitForm}>
        {({ form, handleSubmit }) => {
          formApi.current = form;

          return (
            <form onSubmit={handleSubmit}>
              <Box className={styles.body}>
                <Input label="Destination" gap="1/5" value={programId} readOnly />
                <FormPayload name="payload" label="Payload" values={payloadFormValues} gap="1/5" />
                <GasField info={gasInfo} disabled={isGasDisabled} onGasCalculate={handleGasCalculate} gap="1/5" />
                <FormInput name="value" label="Value" gap="1/5" />
              </Box>

              <Button
                type="submit"
                text="Send Message"
                icon={sendSVG}
                size="large"
                color="secondary"
                className={styles.button}
                disabled={isDisabled}
              />
              <Button text="Cancel" icon={closeSVG} size="large" color="light" onClick={goBack} />
            </form>
          );
        }}
      </Form>
    </>
  );
};

export { SendMessage };
