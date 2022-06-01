import { useState, useMemo, useEffect } from 'react';
import { useField } from 'formik';
import { Checkbox } from '@gear-js/ui';

import styles from './FormPayload.module.scss';
import { FormPayloadValues, PayloadTypeStructures } from './types';
import { getPayloadFormValues } from './helpers';
import { PayloadStructure } from './PayloadStructure';

import { getPreformattedText } from 'helpers';
import { FormTextarea } from 'components/common/FormFields/FormTextarea';

type Props = {
  name: string;
  typeStructures?: PayloadTypeStructures;
};

const FormPayload = (props: Props) => {
  const { name, typeStructures } = props;

  const payload = typeStructures?.payload;
  const manualPayload = typeStructures?.manualPayload;

  const [, , helpers] = useField<FormPayloadValues>(name);

  const [isManualView, setIsManualView] = useState(!payload);

  const handleViewChange = () => setIsManualView((prevState) => !prevState);

  const parsedPayload = useMemo(() => (payload ? getPayloadFormValues(payload) : ''), [payload]);

  const preformattedManual = useMemo(() => (manualPayload ? getPreformattedText(manualPayload) : ''), [manualPayload]);

  useEffect(() => {
    if (!typeStructures) {
      return;
    }

    helpers.setValue(isManualView ? preformattedManual : parsedPayload, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeStructures, isManualView]);

  return (
    <div className={styles.formPayload}>
      {payload && (
        <div className={styles.manualCheckboxWrapper}>
          <Checkbox type="switch" label="Manual input" checked={isManualView} onChange={handleViewChange} />
        </div>
      )}
      {isManualView || !payload ? (
        <FormTextarea id={name} rows={15} name={name} placeholder="// Enter your payload here" />
      ) : (
        <PayloadStructure levelName={name} typeStructure={payload} />
      )}
    </div>
  );
};

export { FormPayload };
