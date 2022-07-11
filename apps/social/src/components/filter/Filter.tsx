import { Button } from './button';
import styles from './Filter.module.scss';

type Props = {
  list: string[];
  value: string;
  onChange: (value: string) => void;
};

function Filter({ list, value, onChange }: Props) {
  const getButtons = () =>
    list.map((filter) => (
      <Button key={filter} text={filter} isActive={filter === value} onClick={() => onChange(filter)} />
    ));

  return (
    <div className={styles.filter} role="group">
      {getButtons()}
    </div>
  );
}

export { Filter };
