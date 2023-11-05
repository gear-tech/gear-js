import { ProgramMetadata } from '@gear-js/api';
import { Button, Input, Textarea } from '@gear-js/ui';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import sendSVG from '@/shared/assets/images/actions/send.svg?react';
import { ValueField } from '@/shared/ui/form';
import { Box } from '@/shared/ui/box';
import { BackButton } from '@/shared/ui/backButton';
import { GasMethod } from '@/shared/config';
import { getValidation } from '@/shared/helpers';
import { GasField } from '@/features/gasField';
import { FormPayload, getPayloadFormValues, getSubmitPayload } from '@/features/formPayload';
import { useBalanceMultiplier, useGasCalculate, useGasMultiplier, useMessageActions } from '@/hooks';
import { Result } from '@/hooks/useGasCalculate/types';
import { FormPayloadType } from '@/features/formPayloadType';
import { UseVoucherCheckbox } from '@/features/voucher';
import { LabeledCheckbox } from '@/shared/ui';

import { getValidationSchema, resetPayloadValue } from '../helpers';
import { FormValues, INITIAL_VALUES } from '../model';
import styles from './MessageForm.module.scss';

type Props = {
  id: HexString;
  programId: HexString | undefined;
  isReply: boolean;
  isLoading: boolean;
  metadata?: ProgramMetadata | undefined;
};

const MessageForm = ({ id, programId, isReply, metadata, isLoading }: Props) => {
  const { api, isApiReady, isVaraVersion } = useApi();
  const { account } = useAccount();

  // TODO:
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const methods = useForm<FormValues>({ defaultValues: INITIAL_VALUES });
  const { getValues, reset, setValue } = methods;

  const calculateGas = useGasCalculate();
  const { sendMessage, replyMessage } = useMessageActions();
  const { balanceMultiplier, decimals } = useBalanceMultiplier();
  const { gasMultiplier } = useGasMultiplier();

  const [isDisabled, setIsDisabled] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);
  const [gasInfo, setGasInfo] = useState<Result>();

  // const formApi = useRef<FormApi<FormValues>>();

  const deposit = isApiReady ? api.existentialDeposit.toString() : '';
  const maxGasLimit = isApiReady ? api.blockGasLimit.toString() : '';

  const method = isReply ? GasMethod.Reply : GasMethod.Handle;
  const typeIndex = isReply ? metadata?.types.reply : metadata?.types.handle.input;
  const isTypeIndex = typeIndex !== undefined && typeIndex !== null;

  const payloadFormValues = useMemo(
    () => (metadata && isTypeIndex ? getPayloadFormValues(metadata, typeIndex) : undefined),
    [metadata, isTypeIndex, typeIndex],
  );

  const validation = useMemo(
    () => {
      const schema = getValidationSchema({
        // BigNumber cuz of floating point,
        // is there a way to handle balance convertion better?
        deposit: BigNumber(deposit).dividedBy(balanceMultiplier),
        metadata,
        maxGasLimit: BigNumber(maxGasLimit).dividedBy(gasMultiplier),
        balanceMultiplier,
        decimals,
        gasMultiplier,
      });

      return getValidation(schema);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadata],
  );

  const disableSubmitButton = () => setIsDisabled(true);
  const enableSubmitButton = () => setIsDisabled(false);

  const resetForm = () => {
    const values = getValues();
    const payload = resetPayloadValue(values.payload);

    reset({ ...INITIAL_VALUES, payload });
    enableSubmitButton();
    setGasInfo(undefined);
  };

  const handleSubmitForm = (values: FormValues) => {
    disableSubmitButton();

    const payloadType = metadata ? undefined : values.payloadType;
    const { withVoucher, keepAlive } = values;

    const baseValues = {
      value: BigNumber(values.value).multipliedBy(balanceMultiplier).toFixed(),
      payload: getSubmitPayload(values.payload),
      gasLimit: BigNumber(values.gasLimit).multipliedBy(gasMultiplier).toFixed(),
    };

    const commonValues = isVaraVersion
      ? { ...baseValues, prepaid: withVoucher, account: withVoucher ? account?.decodedAddress : undefined }
      : { ...baseValues, keepAlive };

    if (isReply) {
      const reply = { ...commonValues, replyToId: id };
      replyMessage({ reply, metadata, payloadType, withVoucher, reject: enableSubmitButton, resolve: resetForm });
    } else {
      const message = { ...commonValues, destination: id };
      sendMessage({ message, metadata, payloadType, withVoucher, reject: enableSubmitButton, resolve: resetForm });
    }
  };

  const handleGasCalculate = () => {
    setIsGasDisabled(true);

    const values = getValues();
    const preparedValues = {
      ...values,
      value: BigNumber(values.value).multipliedBy(balanceMultiplier).toFixed(),
      payload: getSubmitPayload(values.payload),
    };

    calculateGas(method, preparedValues, null, metadata, id)
      .then((info) => {
        const limit = BigNumber(info.limit).dividedBy(gasMultiplier).toFixed();

        setValue('gasLimit', limit);
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

          {!isLoading && !metadata && <FormPayloadType name="payloadType" label="Payload type" gap="1/5" />}

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

          {!isVaraVersion && (
            <LabeledCheckbox name="keepAlive" label="Account existence:" inputLabel="Keep alive" gap="1/5" />
          )}
          <UseVoucherCheckbox programId={programId} />
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
