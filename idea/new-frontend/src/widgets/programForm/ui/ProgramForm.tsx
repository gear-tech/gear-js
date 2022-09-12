import { useState, useMemo, useRef, ReactNode } from 'react';
import { FormApi } from 'final-form';
import { Form } from 'react-final-form';
import clsx from 'clsx';
import { Metadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';

import { useChangeEffect } from 'hooks';
import { Payload } from 'hooks/useProgramActions/types';
import { FormPayload, getSubmitPayload, getPayloadFormValues } from 'features/formPayload';
import { getValidation } from 'shared/helpers';
import { FormInput, FormPayloadType, FormNumberFormat, formStyles } from 'shared/ui/form';

import styles from './ProgramForm.module.scss';
import { getValidationSchema } from '../helpers';
import { INITIAL_VALUES, FormValues, PropsToRenderButtons, Helpers } from '../model';

type Props = {
  name: string;
  label: string;
  metadata?: Metadata;
  metadataBuffer?: string;
  onSubmit: (payload: Payload, helpers: Helpers) => Promise<void> | void;
  renderButtons: (props: PropsToRenderButtons) => ReactNode;
};

const ProgramForm = ({ name, label, metadata, metadataBuffer, onSubmit, renderButtons }: Props) => {
  const { api } = useApi();

  const formApi = useRef<FormApi<FormValues>>();
  const [isDisabled, setIsDisables] = useState(false);

  const handleResetForm = (resetForm: () => void) => () => {
    // dropMetaFile();
    resetForm();
  };

  const handleSubmitForm = (values: FormValues, form: FormApi<FormValues, FormValues>) => {
    setIsDisables(true);

    const { value, payload, gasLimit, programName, payloadType } = values;

    const finishSubmitting = () => setIsDisables(false);

    const data: Payload = {
      value,
      gasLimit,
      metadata,
      programName,
      metadataBuffer,
      payloadType: metadata ? undefined : payloadType,
      initPayload: metadata ? getSubmitPayload(payload) : payload,
    };

    onSubmit(data, { resetForm: handleResetForm(form.restart), finishSubmitting });
  };

  const encodeType = metadata?.init_input;

  const deposit = api.existentialDeposit.toNumber();
  const maxGasLimit = api.blockGasLimit.toNumber();

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  const validation = useMemo(
    () => {
      const schema = getValidationSchema({ type: encodeType, deposit, metadata, maxGasLimit });

      return getValidation(schema);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadata, encodeType],
  );

  useChangeEffect(() => {
    if (metadata) {
      formApi.current?.change('programName', metadata?.title ?? '');
    } else {
      formApi.current?.restart();
    }
  }, [metadata]);

  return (
    <Form validateOnBlur initialValues={INITIAL_VALUES} validate={validation} onSubmit={handleSubmitForm}>
      {({ form, handleSubmit }) => {
        const { values } = form.getState();

        formApi.current = form;

        return (
          <form onSubmit={handleSubmit}>
            <div className={styles.formContent}>
              <div className={styles.program}>
                <div className={clsx(formStyles.formItem, styles.file)}>
                  <span className={formStyles.fieldLabel}>{label}</span>
                  <span className={clsx(formStyles.fieldContent, styles.fileName)}>{name}</span>
                </div>

                <FormInput name="programName" label="Name" placeholder="Name" />

                <FormNumberFormat
                  name="gasLimit"
                  label="Gas limit"
                  placeholder="1,000,000,000"
                  thousandSeparator
                  allowNegative={false}
                />

                <FormInput min={0} type="number" name="value" label="Initial value" placeholder="0" />

                <FormPayload name="payload" label="Initial payload" values={payloadFormValues} />

                {!metadata && <FormPayloadType name="payloadType" label="Initial payload type" />}
              </div>
            </div>

            <div className={styles.buttons}>{renderButtons({ isDisabled, values, metadata })}</div>
          </form>
        );
      }}
    </Form>
  );
};

export { ProgramForm };
