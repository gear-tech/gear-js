import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useForm, useField } from 'react-final-form';
import clsx from 'clsx';
import { useAlert } from '@gear-js/react-hooks';
import { Checkbox, FileInput, Textarea } from '@gear-js/ui';

import { useChangeEffect } from 'hooks';
import { PayloadValue } from 'entities/formPayload';
import { checkFileFormat, readFileAsync } from 'shared/helpers';
import { FileTypes } from 'shared/config';
import formStyles from 'shared/ui/form/Form.module.scss';

import styles from './FormPayload.module.scss';
import { FormPayloadValues } from '../model/types';
import { PayloadStructure } from './payloadStructure';

type Props = {
  name: string;
  label: string;
  values?: FormPayloadValues;
};

const FormPayload = ({ name, label, values }: Props) => {
  const alert = useAlert();
  const { change } = useForm();
  const { input, meta } = useField<PayloadValue>(name);

  const jsonManualPayload = useRef<string>();

  const [isManualView, setIsManualView] = useState(!values);
  const [manualPayloadFile, setManualPayloadFile] = useState<File>();

  const changeValue = (value: PayloadValue) => change(name, value);

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

  const handleUploadManualPayload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

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

  return (
    <div className={clsx(formStyles.formItem, formStyles.field)}>
      <label htmlFor={name} className={formStyles.fieldLabel}>
        {label}
      </label>
      <div className={formStyles.fieldContent}>
        {values && (
          <Checkbox
            type="switch"
            label="Manual input"
            checked={isManualView}
            className={styles.viewCheckbox}
            onChange={handleViewChange}
          />
        )}
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
            />
            {values && (
              <FileInput
                data-testid="payloadFileInput"
                accept={FileTypes.Json}
                className={styles.fileInput}
                onChange={handleUploadManualPayload}
              />
            )}
          </>
        )}
      </div>
      {meta.error && <div className={formStyles.error}>{meta.error}</div>}
    </div>
  );
};

export { FormPayload };
