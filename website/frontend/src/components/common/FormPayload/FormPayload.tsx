import { useState, useMemo, useEffect } from 'react';
import { useField } from 'formik';
import { Checkbox } from '@gear-js/ui';

import styles from './FormPayload.module.scss';
import { TypeStructure, ParsedTypeStructure } from './types';
import { parseTypeStructure } from './helpers';
import { PayloadStructure } from './PayloadStructure';

import { getPreformattedText } from 'helpers';
import { FormTextarea } from 'components/common/FormFields/FormTextarea';

type Props = {
  name: string;
  typeStructures?: {
    manual: any;
    payload: TypeStructure;
  };
};

const FormPayload = (props: Props) => {
  const { name, typeStructures } = props;

  const manual = typeStructures?.manual;
  const payload = typeStructures?.payload;

  const [, , helpers] = useField<ParsedTypeStructure>(name);

  const [isManualView, setManualView] = useState(!payload);

  const handleViewChange = () => setManualView((prevState) => !prevState);

  const parsedPayload = useMemo(() => (payload ? parseTypeStructure(payload) : ''), [payload]);

  const preformattedManual = useMemo(() => (manual ? getPreformattedText(manual) : ''), [manual]);

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
