import { ProgramMetadata } from '@gear-js/api';
import { Button, Input, Textarea } from '@gear-js/ui';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import BigNumber from 'bignumber.js';
import { useMemo, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';

import { ReactComponent as sendSVG } from 'shared/assets/images/actions/send.svg';
import { ValueField } from 'shared/ui/form';
import { Box } from 'shared/ui/box';
import { BackButton } from 'shared/ui/backButton';
import { GasMethod } from 'shared/config';
import { getValidation } from 'shared/helpers';
import { GasField } from 'features/gasField';
import { FormPayload, getPayloadFormValues, getSubmitPayload } from 'features/formPayload';
import { useBalanceMultiplier, useGasCalculate, useGasMultiplier, useMessageActions } from 'hooks';
import { Result } from 'hooks/useGasCalculate/types';
import { FormPayloadType } from 'features/formPayloadType';
import { IsPrepaidCheckbox } from 'features/voucher';

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
  const { api, isApiReady } = useApi();
  const { account } = useAccount();

  const calculateGas = useGasCalculate();
  const { sendMessage, replyMessage } = useMessageActions();
  const { balanceMultiplier, decimals } = useBalanceMultiplier();
  const { gasMultiplier } = useGasMultiplier();

  const [isDisabled, setIsDisabled] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);
  const [gasInfo, setGasInfo] = useState<Result>();

  const formApi = useRef<FormApi<FormValues>>();

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
      value: BigNumber(values.value).multipliedBy(balanceMultiplier).toFixed(),
      payload: getSubmitPayload(values.payload),
      gasLimit: BigNumber(values.gasLimit).multipliedBy(gasMultiplier).toFixed(),
      prepaid: values.isPrepaid,
      account: values.isPrepaid ? account?.decodedAddress : undefined,
    };

    if (isReply) {
      const reply = { ...commonValues, replyToId: id };
      replyMessage({ reply, metadata, payloadType, reject: enableSubmitButton, resolve: resetForm });
    } else {
      const message = { ...commonValues, destination: id };
      sendMessage({ message, metadata, payloadType, reject: enableSubmitButton, resolve: resetForm });
    }
  };

  const handleGasCalculate = () => {
    if (!formApi.current) return;

    setIsGasDisabled(true);

    const { values } = formApi.current.getState();
    const preparedValues = {
      ...values,
      value: BigNumber(values.value).multipliedBy(balanceMultiplier).toFixed(),
      payload: getSubmitPayload(values.payload),
    };

    calculateGas(method, preparedValues, null, metadata, id)
      .then((info) => {
        const limit = BigNumber(info.limit).dividedBy(gasMultiplier).toFixed();

        formApi.current?.change('gasLimit', limit);
        setGasInfo(info);
      })
      .finally(() => setIsGasDisabled(false));
  };

  return (
    <Form initialValues={INITIAL_VALUES} validate={validation} onSubmit={handleSubmitForm}>
      {({ form, handleSubmit }) => {
        formApi.current = form;

        return (
          <form onSubmit={handleSubmit}>
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

              <IsPrepaidCheckbox programId={programId} />

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
        );
      }}
    </Form>
  );
};

export { MessageForm };
