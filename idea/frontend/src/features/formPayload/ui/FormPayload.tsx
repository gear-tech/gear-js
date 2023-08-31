import { useState, useEffect, useRef } from 'react';
import { useForm, useField } from 'react-final-form';
import clsx from 'clsx';
import { useAlert } from '@gear-js/react-hooks';
import { Checkbox, FileInput, Textarea, InputWrapper, InputProps } from '@gear-js/ui';

import { useChangeEffect } from 'hooks';
import { PayloadValue } from 'entities/formPayload';
import { checkFileFormat, readFileAsync } from 'shared/helpers';
import { FileTypes } from 'shared/config';
import { formStyles } from 'shared/ui/form';

import { FormPayloadValues } from '../model/types';
import { PayloadStructure } from './payloadStructure';
import styles from './FormPayload.module.scss';

type Props = {
  name: string;
  label: string;
  direction?: InputProps['direction'];
  gap?: InputProps['gap'];
  values?: FormPayloadValues;
};

const FormPayload = ({ name, label, values, direction = 'x', gap }: Props) => {
  const alert = useAlert();
  const { change, resetFieldState } = useForm();
  const { input, meta } = useField<PayloadValue>(name);

  const jsonManualPayload = useRef<string>();

  const [isManualView, setIsManualView] = useState(!values);
  const [manualPayloadFile, setManualPayloadFile] = useState<File>();

  const changeValue = (value: PayloadValue) => {
    change(name, value);
    resetFieldState(name);
  };

  const handleViewChange = () => setIsManualView((prevState) => !prevState);

  const resetFileData = () => {
    setManualPayloadFile(undefined);
    jsonManualPayload.current = undefined;
  };

  const dropManualPayloadFile = () => {
    resetFileData();

    if (values) {
      changeValue(values.manualPayload);
    }
  };

  const handleUploadManualPayload = async (file: File | undefined) => {
    if (!file) {
      return dropManualPayloadFile();
    }

    try {
      if (!checkFileFormat(file, FileTypes.Json)) {
        throw new Error('Wrong file format');
      }

      setManualPayloadFile(file);

      const fileText = await readFileAsync(file, 'text');

      changeValue(fileText);
      jsonManualPayload.current = fileText;
    } catch (error: unknown) {
      alert.error((error as Error).message);
    }
  };

  useEffect(() => {
    if (!values) {
      return;
    }

    const payloadValue = isManualView ? jsonManualPayload.current ?? values.manualPayload : values.payload;

    changeValue(payloadValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManualView]);

  useChangeEffect(() => {
    if (!values && manualPayloadFile) {
      resetFileData();
    }

    setIsManualView(!values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  // TODO: meta.error is object - final-form bug
  const error = meta.invalid ? 'Invalid payload' : undefined;

  return (
    <InputWrapper
      id={name}
      size="normal"
      label={label}
      error={error}
      direction={direction}
      gap={gap}
      className={clsx(formStyles.field, values && formStyles.gap16)}>
      {values && (
        <Checkbox
          type="switch"
          label="Manual input"
          checked={isManualView}
          className={formStyles.checkbox}
          onChange={handleViewChange}
        />
      )}

      <div>
        {!isManualView && values ? (
          <PayloadStructure levelName={name} typeStructure={values.typeStructure} />
        ) : (
          <>
            <Textarea
              {...input}
              id={name}
              rows={15}
              value={input.value as string}
              placeholder="// Enter your payload here"
              block
            />
            {values && (
              <FileInput
                value={manualPayloadFile}
                accept={FileTypes.Json}
                className={styles.fileInput}
                onChange={handleUploadManualPayload}
              />
            )}
          </>
        )}
      </div>
    </InputWrapper>
  );
};

export { FormPayload };
