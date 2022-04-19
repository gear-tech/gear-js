import React, { ChangeEvent } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Field } from 'formik';
import { Checkbox } from '@gear-js/ui';
import { MetaFields, MetaFieldsStruct } from 'components/MetaFields';
import styles from './FormPayload.module.scss';

type Props = {
  className?: string;
  isManualInput: boolean;
  setIsManualInput: (value: boolean) => void;
  formData: MetaFieldsStruct | null | undefined;
};

const FormPayload = ({ className, isManualInput, setIsManualInput, formData }: Props) => {
  // this check is for MessageForm UX,
  // since in State we simply don't render FormPayload if there's no formData
  const isLocked = !formData;

  const handleManualInputChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setIsManualInput(checked);
  };

  const handleFormItemError = (error: Error) => {
    setIsManualInput(true);
    console.error(error);
  };

  return (
    <div className={className}>
      {formData && (
        <Checkbox
          type="switch"
          label="Manual input"
          className={styles.switch}
          checked={isManualInput}
          onChange={handleManualInputChange}
        />
      )}
      {isManualInput || isLocked ? (
        <>
          {isLocked && <p className={styles.message}>Can't parse metadata, try to use manual input.</p>}
          <p className={styles.notice}>JSON or hex</p>
          <Field
            id="payload"
            name="payload"
            as="textarea"
            type="text"
            placeholder="// Enter your payload here"
            rows={15}
          />
        </>
      ) : (
        <ErrorBoundary
          fallback={<p className={styles.message}>Sorry, something went wrong. You can use manual input.</p>}
          onError={handleFormItemError}
        >
          <MetaFields data={formData} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export { FormPayload };
