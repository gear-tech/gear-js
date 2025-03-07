import { useAlert, useBalanceFormat } from '@gear-js/react-hooks';
import { Button, Input } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@polkadot/util/types';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';
import { z } from 'zod';

import { GasField } from '@/features/gasField';
import { PayloadForm, getResetPayloadValue, useService, PayloadValue, PayloadValueSchema } from '@/features/sails';
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

import styles from './message-form.module.scss';

type Props = {
  id: HexString;
  programId: HexString | undefined;
  isReply: boolean;
  sails: Sails;
};

const DEFAULT_VALUES = {
  value: '0',
  gasLimit: '0',
  voucherId: '',
  keepAlive: true,
};

type Values = {
  value: string;
  gasLimit: string;
  voucherId: string;
  keepAlive: boolean;
  payload: PayloadValue;
};

const useSchema = (payloadSchema: PayloadValueSchema) => {
  const balanceSchema = useBalanceSchema();
  const gasLimitSchema = useGasLimitSchema();

  return z.object({
    payload: payloadSchema,
    value: balanceSchema,
    gasLimit: gasLimitSchema,
    keepAlive: z.boolean(),
    voucherId: z.string().trim(),
  });
};

type FormattedValues = z.infer<ReturnType<typeof useSchema>>;

const SailsMessageForm = ({ id, programId, isReply, sails }: Props) => {
  const { getFormattedGasValue } = useBalanceFormat();
  const alert = useAlert();
  const service = useService(sails, 'functions');

  const defaultValues = { ...DEFAULT_VALUES, payload: service.defaultValues };
  const schema = useSchema(service.schema);
  const form = useForm<Values, unknown, FormattedValues>({ values: defaultValues, resolver: zodResolver(schema) });

  const calculateGas = useGasCalculate();
  const { sendMessage, replyMessage } = useMessageActions();

  const [isDisabled, setIsDisabled] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);
  const [gasInfo, setGasInfo] = useState<Result>();

  const method = isReply ? GasMethod.Reply : GasMethod.Handle;

  const disableSubmitButton = () => setIsDisabled(true);
  const enableSubmitButton = () => setIsDisabled(false);

  const resetForm = () => {
    const values = form.getValues();
    const resetValue = { ...DEFAULT_VALUES, payload: getResetPayloadValue(values.payload) };

    form.reset(resetValue);
    enableSubmitButton();
    setGasInfo(undefined);
  };

  const handleSubmitForm = form.handleSubmit(({ voucherId, ...values }) => {
    disableSubmitButton();

    const payloadType = 'Bytes';
    const reject = enableSubmitButton;
    const resolve = resetForm;

    if (isReply) return replyMessage({ reply: { ...values, replyToId: id }, payloadType, voucherId, reject, resolve });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO(#1800): resolve eslint comments
    sendMessage({ message: { ...values, destination: id }, payloadType, voucherId, reject, resolve });
  });

  const handleGasCalculate = async () => {
    setIsGasDisabled(true);

    const values = form.getValues();

    try {
      const info = await calculateGas(method, schema.parse(values), null, undefined, id);
      const limit = getFormattedGasValue(info.limit).toFixed();

      form.setValue('gasLimit', limit, { shouldValidate: true });
      setGasInfo(info);
    } catch (error) {
      alert.error(getErrorMessage(error));
    } finally {
      setIsGasDisabled(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmitForm}>
        <Box className={styles.body}>
          <Input label={isReply ? 'Message Id:' : 'Destination:'} gap="1/5" value={id} readOnly />

          <PayloadForm
            gap="1/5"
            sails={sails}
            select={service.select}
            functionSelect={service.functionSelect}
            args={service.args}
          />

          <ValueField name="value" label="Value:" gap="1/5" />

          <GasField info={gasInfo} disabled={isGasDisabled} onGasCalculate={handleGasCalculate} gap="1/5" />

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
          disabled={isDisabled}
        />
        <BackButton />
      </form>
    </FormProvider>
  );
};

export { SailsMessageForm };
