import { useAlert } from '@gear-js/react-hooks';
import { Checkbox, FileInput, Textarea, InputWrapper, InputProps } from '@gear-js/ui';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { useChangeEffect } from '@/hooks';
import { checkFileFormat, readFileAsync } from '@/shared/helpers';
import { FileTypes } from '@/shared/config';
import { formStyles } from '@/shared/ui/form';

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
  const { setValue, register } = useFormContext();

  const jsonManualPayload = useRef<string>();

  const [isManualView, setIsManualView] = useState(!values);
  const [manualPayloadFile, setManualPayloadFile] = useState<File>();

  const handleViewChange = () => setIsManualView((prevState) => !prevState);

  const resetFileData = () => {
    setManualPayloadFile(undefined);
    jsonManualPayload.current = undefined;
  };

  const dropManualPayloadFile = () => {
    resetFileData();

    if (values) setValue(name, values.manualPayload);
  };

  const handleUploadManualPayload = async (file: File | undefined) => {
    if (!file) return dropManualPayloadFile();

    try {
      if (!checkFileFormat(file, FileTypes.Json)) {
        throw new Error('Wrong file format');
      }

      setManualPayloadFile(file);

      const fileText = await readFileAsync(file, 'text');

      setValue(name, fileText);
      jsonManualPayload.current = fileText;
    } catch (error: unknown) {
      alert.error((error as Error).message);
    }
  };

  useEffect(() => {
    if (!values) return;

    const payloadValue = isManualView ? jsonManualPayload.current ?? values.manualPayload : values.payload;

    setValue(name, payloadValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManualView]);

  useChangeEffect(() => {
    if (!values && manualPayloadFile) resetFileData();

    setIsManualView(!values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <InputWrapper
      id={name}
      size="normal"
      label={label}
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
            <Textarea id={name} rows={15} placeholder="// Enter your payload here" block {...register(name)} />
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
