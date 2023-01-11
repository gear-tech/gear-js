import { Radio } from '@gear-js/ui';
import styles from './Functions.module.scss';

type Props = {
  list: string[];
  value: string;
  onChange: (value: string) => void;
};

const Functions = ({ list, value, onChange }: Props) => {
  const getRadioButtons = () =>
    list.map((func) => (
      <li key={func}>
        <Radio label={func} name="functions" checked={value === func} onChange={() => onChange(func)} />
      </li>
    ));

  return <ul className={styles.list}>{getRadioButtons()}</ul>;
};

export { Functions };
