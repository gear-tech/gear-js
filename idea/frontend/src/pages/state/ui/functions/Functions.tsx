import { Radio } from '@gear-js/ui';

import styles from './Functions.module.scss';

type Props = {
  list: string[];
  value: string;
  onChange: (funcId: string, funcName: string) => void;
  stateId?: string;
};

const Functions = ({ list, value, onChange, stateId }: Props) => {
  const getRadioButtons = () =>
    list.map((func) => {
      const id = stateId ? `${stateId}-${func}` : func;

      return (
        <li key={id}>
          <Radio label={func} name="functions" checked={value === id} onChange={() => onChange(id, func)} />
        </li>
      );
    });

  return <ul className={styles.list}>{getRadioButtons()}</ul>;
};

export { Functions };
