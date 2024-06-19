import { ProgramMetadata } from '@gear-js/api';
import { Button, Input, Textarea } from '@gear-js/ui';
import { useBalanceFormat } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import sendSVG from '@/shared/assets/images/actions/send.svg?react';
import { ValueField } from '@/shared/ui/form';
import { Box } from '@/shared/ui/box';
import { BackButton } from '@/shared/ui/backButton';
import { GasMethod } from '@/shared/config';
import { GasField } from '@/features/gasField';
import { FormPayload, getPayloadFormValues, getResetPayloadValue, getSubmitPayload } from '@/features/formPayload';
import { useGasCalculate, useMessageActions, useValidationSchema } from '@/hooks';
import { Result } from '@/hooks/useGasCalculate/types';
import { ProgramVoucherSelect } from '@/features/voucher';
import { LabeledCheckbox } from '@/shared/ui';

import { FormValues, INITIAL_VALUES } from '../model';
import styles from './message-form.module.scss';

type Props = {
  id: HexString;
  programId: HexString | undefined;
  isReply: boolean;
  isLoading: boolean;
  metadata?: ProgramMetadata | undefined;
};

const MessageForm = ({ id, programId, isReply, metadata, isLoading }: Props) => {
  const { getChainBalanceValue, getFormattedGasValue, getChainGasValue } = useBalanceFormat();
  const schema = useValidationSchema();

  // TODOFORM:
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const methods = useForm<FormValues>({ defaultValues: INITIAL_VALUES, resolver: yupResolver(schema) });
  const { getValues, reset, setValue, register, getFieldState, formState } = methods;
  const { error: payloadTypeError } = getFieldState('payloadType', formState);

  const calculateGas = useGasCalculate();
  const { sendMessage, replyMessage } = useMessageActions();

  const [isDisabled, setIsDisabled] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);
  const [gasInfo, setGasInfo] = useState<Result>();

  const method = isReply ? GasMethod.Reply : GasMethod.Handle;
  const typeIndex = isReply ? metadata?.types.reply : metadata?.types.handle.input;
  const isTypeIndex = typeIndex !== undefined && typeIndex !== null;

  const payloadFormValues = useMemo(
    () => (metadata && isTypeIndex ? getPayloadFormValues(metadata, typeIndex) : undefined),
    [metadata, isTypeIndex, typeIndex],
  );

  const disableSubmitButton = () => setIsDisabled(true);
  const enableSubmitButton = () => setIsDisabled(false);

  const resetForm = () => {
    const values = getValues();
    const payload = getResetPayloadValue(values.payload);

    reset({ ...INITIAL_VALUES, payload });
    enableSubmitButton();
    setGasInfo(undefined);
  };

  const handleSubmitForm = (values: FormValues) => {
    disableSubmitButton();

    const payloadType = metadata ? undefined : values.payloadType;
    const { voucherId, keepAlive } = values;

    const baseValues = {
      value: getChainBalanceValue(values.value).toFixed(),
      payload: getSubmitPayload(values.payload),
      gasLimit: getChainGasValue(values.gasLimit).toFixed(),
      keepAlive,
    };

    if (isReply) {
      const reply = { ...baseValues, replyToId: id };
      replyMessage({ reply, metadata, payloadType, voucherId, reject: enableSubmitButton, resolve: resetForm });
    } else {
      const message = { ...baseValues, destination: id };
      sendMessage({ message, metadata, payloadType, voucherId, reject: enableSubmitButton, resolve: resetForm });
    }
  };

  const handleGasCalculate = () => {
    setIsGasDisabled(true);

    const values = getValues();

    const preparedValues = {
      ...values,
      value: getChainBalanceValue(values.value).toFixed(),
      payload: getSubmitPayload(values.payload),
    };

    calculateGas(method, preparedValues, null, metadata, id)
      .then((info) => {
        const limit = getFormattedGasValue(info.limit).toFixed();

        setValue('gasLimit', limit, { shouldValidate: true });
        setGasInfo(info);
      })
      .finally(() => setIsGasDisabled(false));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
        <Box className={styles.body}>
          {isLoading ? (
            <Input label="Destination:" gap="1/5" className={styles.loading} value="" readOnly />
          ) : (
            <Input label={isReply ? 'Message Id:' : 'Destination:'} gap="1/5" value={id} readOnly />
          )}

          {isLoading ? (
            <Textarea label="Payload" gap="1/5" className={styles.loading} readOnly />
          ) : (
            <FormPayload name="payload" label="Payload" values={payloadFormValues} gap="1/5" />
          )}

          {!isLoading && !metadata && (
            <Input label="Payload type" gap="1/5" {...register('payloadType')} error={payloadTypeError?.message} />
          )}

          {isLoading ? (
            <Input label="Value:" gap="1/5" className={styles.loading} readOnly />
          ) : (
            <ValueField name="value" label="Value:" gap="1/5" />
          )}

          {isLoading ? (
            <Input label="Gas info" gap="1/5" className={styles.loading} readOnly />
          ) : (
            <GasField
              info={gasInfo}
              disabled={isLoading || isGasDisabled}
              onGasCalculate={handleGasCalculate}
              gap="1/5"
            />
          )}

          <LabeledCheckbox name="keepAlive" label="Account existence:" inputLabel="Keep alive" gap="1/5" />
          <ProgramVoucherSelect programId={programId} />
        </Box>

        <Button
          type="submit"
          text="Send Message"
          icon={sendSVG}
          size="large"
          color="secondary"
          className={styles.button}
          disabled={isLoading || isDisabled}
        />
        <BackButton />
      </form>
    </FormProvider>
  );
};

export { MessageForm };
