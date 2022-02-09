import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Field } from 'formik';
import { Switch } from 'common/components/Switch';
import { FormItem } from 'components/FormItem';
import styles from './FormPayload.module.scss';
import { ParsedShape } from 'utils/meta-parser';

type Props = {
  className: string;
  isManualInput: boolean;
  setIsManualInput: Dispatch<SetStateAction<boolean>>;
  formData: ParsedShape;
};

const FormPayload = ({ className, isManualInput, setIsManualInput, formData }: Props) => {
  const handleManualInputChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setIsManualInput(checked);
  };

  return (
    <div className={className}>
      <Switch
        label="Manual input"
        className={styles.switch}
        checked={isManualInput}
        onChange={handleManualInputChange}
      />
      {isManualInput ? (
        <>
          <p className="message-form__manual-input-notice">JSON or hex</p>
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
        <FormItem data={formData} />
      )}
    </div>
  );
};

export { FormPayload };
