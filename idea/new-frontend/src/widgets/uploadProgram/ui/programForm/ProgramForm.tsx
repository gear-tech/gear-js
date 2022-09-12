import { useState, useMemo, useRef, useEffect, ReactNode, ChangeEvent } from 'react';
import { FormApi } from 'final-form';
import { Form } from 'react-final-form';
import clsx from 'clsx';
import { Metadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { FileInput } from '@gear-js/ui';

import { useChangeEffect } from 'hooks';
import { Payload } from 'hooks/useProgramActions/types';
import { FormPayload, getSubmitPayload, getPayloadFormValues } from 'features/formPayload';
import { FormPayloadType } from 'features/formPayloadType';
import { getValidation } from 'shared/helpers';
import { FormInput, FormNumberFormat, formStyles } from 'shared/ui/form';

import styles from './ProgramForm.module.scss';
import widgetStyles from '../UploadProgram.module.scss';
import { getValidationSchema } from '../../helpers';
import { INITIAL_VALUES, FormValues, PropsToRenderButtons, Helpers } from '../../model';

type Props = {
  file: File;
  label: string;
  metadata?: Metadata;
  metadataBuffer?: string;
  onSubmit: (payload: Payload, helpers: Helpers) => Promise<void> | void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  renderButtons: (props: PropsToRenderButtons) => ReactNode;
};

const ProgramForm = (props: Props) => {
  const { file, label, metadata, metadataBuffer, onSubmit, onFileChange, renderButtons } = props;

  const { api } = useApi();

  const formApi = useRef<FormApi<FormValues>>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisables] = useState(false);

  const changeProgramName = (meta: Metadata) => formApi.current?.change('programName', meta?.title ?? '');

  const setFileInputValue = () => {
    const target = fileInputRef.current;

    if (target) {
      const dataTransfer = new DataTransfer();

      dataTransfer.items.add(file);
      target.files = dataTransfer.files;
      target.dispatchEvent(new Event('change', { bubbles: true }));
      // Help Safari out
      if (target.webkitEntries.length) {
        target.dataset.file = `${dataTransfer.files[0].name}`;
      }
    }
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

    onSubmit(data, { resetForm: form.restart, finishSubmitting });
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

  useEffect(() => {
    if (metadata) {
      changeProgramName(metadata);
    }

    setFileInputValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useChangeEffect(() => {
    if (metadata) {
      changeProgramName(metadata);
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
            <div className={clsx(styles.formContent, widgetStyles.lining)}>
              <FileInput
                ref={fileInputRef}
                label={label}
                direction="y"
                onChange={onFileChange}
                className={formStyles.field}
              />

              <FormInput size="large" name="programName" label="Name" placeholder="Name" />

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

            <div className={styles.buttons}>{renderButtons({ isDisabled, values, metadata })}</div>
          </form>
        );
      }}
    </Form>
  );
};

export { ProgramForm };
