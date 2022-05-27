import { Checkbox } from '@gear-js/ui';

import styles from './FormPayload.module.scss';
import { TypeStructure } from './types';
import { PayloadStructure } from './PayloadStructure';

import { FormTextarea } from 'components/common/FormFields/FormTextarea';

type Props = {
  name: string;
  payload?: TypeStructure;
  isManualView: boolean;
  onViewChange: () => void;
};

const FormPayload = (props: Props) => {
  const { name, payload, isManualView, onViewChange } = props;

  return (
    <div className={styles.formPayload}>
      {payload && (
        <div className={styles.manualCheckboxWrapper}>
          <Checkbox type="switch" label="Manual input" checked={isManualView} onChange={onViewChange} />
        </div>
      )}
      {isManualView || !payload ? (
        <FormTextarea rows={15} name={name} placeholder="// Enter your payload here" />
      ) : (
        <PayloadStructure levelName={name} typeStructure={payload} />
      )}
    </div>
  );
};

export { FormPayload };
