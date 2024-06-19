import { useBalanceFormat } from '@gear-js/react-hooks';
import { Button, Input } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';

import sendSVG from '@/shared/assets/images/actions/send.svg?react';
import { ValueField } from '@/shared/ui/form';
import { Box } from '@/shared/ui/box';
import { BackButton } from '@/shared/ui/backButton';
import { GasMethod } from '@/shared/config';
import { GasField } from '@/features/gasField';
import { getResetPayloadValue } from '@/features/formPayload';
import { useGasCalculate, useMessageActions, useTransactionSchema } from '@/hooks';
import { Result } from '@/hooks/useGasCalculate/types';
import { ProgramVoucherSelect } from '@/features/voucher';
import { LabeledCheckbox } from '@/shared/ui';
import { PayloadForm, useService } from '@/features/sails';

import styles from './message-form.module.scss';

type Props = {
  id: HexString;
  programId: HexString | undefined;
  isReply: boolean;
  sails: Sails;
};

// TODO: DROP PROGRAM NAME!
const DEFAULT_VALUES = {
  value: '0',
  gasLimit: '0',
  programName: 'name',
  keepAlive: true,
};

const SailsMessageForm = ({ id, programId, isReply, sails }: Props) => {
  const { getFormattedGasValue } = useBalanceFormat();
  const service = useService(sails);

  const defaultValues = { ...DEFAULT_VALUES, payload: service.defaultValues };
  const schema = useTransactionSchema(service.schema);
  const form = useForm({ values: defaultValues, resolver: zodResolver(schema) });

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
    const payload = getResetPayloadValue(values.payload);

    // reset({ ...INITIAL_VALUES, payload });
    enableSubmitButton();
    setGasInfo(undefined);
  };

  const handleSubmitForm = form.handleSubmit((values) => {
    console.log('values: ', values);
    // disableSubmitButton();

    const payloadType = 'Bytes';
    const voucherId = '';

    // const payloadType = metadata ? undefined : values.payloadType;
    // const { voucherId, keepAlive } = values;

    // const baseValues = {
    //   value: getChainBalanceValue(values.value).toFixed(),
    //   payload: getSubmitPayload(values.payload),
    //   gasLimit: getChainGasValue(values.gasLimit).toFixed(),
    //   keepAlive,
    // };

    // if (isReply) {
    //   const reply = { ...baseValues, replyToId: id };
    //   replyMessage({ reply, metadata, payloadType, voucherId, reject: enableSubmitButton, resolve: resetForm });
    // } else {
    const message = { ...values, destination: id };
    sendMessage({ message, payloadType, voucherId, reject: enableSubmitButton, resolve: resetForm });
    // }
  });

  const handleGasCalculate = () => {
    setIsGasDisabled(true);

    const values = form.getValues();

    calculateGas(method, schema.parse(values), null, undefined, id)
      .then((info) => {
        const limit = getFormattedGasValue(info.limit).toFixed();

        form.setValue('gasLimit', limit, { shouldValidate: true });
        setGasInfo(info);
      })
      .finally(() => setIsGasDisabled(false));
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
          disabled={isDisabled}
        />
        <BackButton />
      </form>
    </FormProvider>
  );
};

export { SailsMessageForm };
