import { ProgramMetadata } from '@gear-js/api';
import { useAlert, useBalanceFormat } from '@gear-js/react-hooks';
import { Button, Input, Textarea } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@polkadot/util/types';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { PayloadValue } from '@/entities/formPayload';
import { FormPayload, getPayloadFormValues, getResetPayloadValue, getSubmitPayload } from '@/features/formPayload';
import { GasField } from '@/features/gasField';
import { ProgramVoucherSelect } from '@/features/voucher';
import { useBalanceSchema, useGasCalculate, useGasLimitSchema, useMessageActions } from '@/hooks';
import { Result } from '@/hooks/useGasCalculate/types';
import sendSVG from '@/shared/assets/images/actions/send.svg?react';
import { GasMethod } from '@/shared/config';
import { getErrorMessage } from '@/shared/helpers';
import { LabeledCheckbox } from '@/shared/ui';
import { BackButton } from '@/shared/ui/backButton';
import { Box } from '@/shared/ui/box';
import { ValueField } from '@/shared/ui/form';

import { INITIAL_VALUES } from '../model';

import styles from './message-form.module.scss';

function useValidationSchema() {
  const balanceSchema = useBalanceSchema();
  const gasLimitSchema = useGasLimitSchema();

  return z.object({
    value: balanceSchema,
    gasLimit: gasLimitSchema,

    // passthrough properties to mimic legacy yup logic
    payloadType: z.string().trim().min(1, 'This field is required'),
    payload: z.unknown().transform((value) => value as PayloadValue),
    keepAlive: z.boolean(),
    voucherId: z.string(),
  });
}

type Props = {
  id: HexString;
  programId: HexString | undefined;
  isReply: boolean;
  isLoading: boolean;
  metadata?: ProgramMetadata | undefined;
};

const MessageForm = ({ id, programId, isReply, metadata, isLoading }: Props) => {
  const { getChainBalanceValue, getFormattedGasValue, getChainGasValue } = useBalanceFormat();
  const alert = useAlert();
  const schema = useValidationSchema();

  const methods = useForm({ defaultValues: INITIAL_VALUES, resolver: zodResolver(schema) });
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
    const payload = getResetPayloadValue(values.payload as PayloadValue);

    reset({ ...INITIAL_VALUES, payload });
    enableSubmitButton();
    setGasInfo(undefined);
  };

  const handleSubmitForm = (values: z.infer<typeof schema>) => {
    disableSubmitButton();

    const payloadType = metadata ? undefined : values.payloadType;
    const { voucherId, keepAlive } = values;

    const baseValues = {
      value: getChainBalanceValue(values.value).toFixed(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
      payload: getSubmitPayload(values.payload as PayloadValue),
      gasLimit: getChainGasValue(values.gasLimit).toFixed(),
      keepAlive: keepAlive,
    };

    if (isReply) {
      const reply = { ...baseValues, replyToId: id };

      void replyMessage({
        reply,
        metadata,
        payloadType,
        voucherId: voucherId as HexString,
        reject: enableSubmitButton,
        resolve: resetForm,
      });
    } else {
      const message = { ...baseValues, destination: id };

      void sendMessage({
        message,
        metadata,
        payloadType,
        voucherId: voucherId as HexString,
        reject: enableSubmitButton,
        resolve: resetForm,
      });
    }
  };

  const handleGasCalculate = () => {
    setIsGasDisabled(true);

    const values = getValues();

    const preparedValues = {
      ...values,
      value: getChainBalanceValue(values.value).toFixed(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
      payload: getSubmitPayload(values.payload as PayloadValue),
    };

    calculateGas(method, preparedValues, null, metadata, id)
      .then((info) => {
        const limit = getFormattedGasValue(info.limit).toFixed();

        setValue('gasLimit', limit, { shouldValidate: true });
        setGasInfo(info);
      })
      .catch((error) => alert.error(getErrorMessage(error)))
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

          <LabeledCheckbox name="keepAlive" label="Account protection:" inputLabel="Keep alive" gap="1/5" />
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
