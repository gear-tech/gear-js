import { cx } from '@/shared/helpers';

import { PROGRAM_TABS } from '../../consts';
import { ProgramTabId } from '../../types';

import styles from './program-tabs.module.scss';

type Props = {
  value: string;
  onChange: (id: ProgramTabId) => void;
};

function ProgramTabs({ value, onChange }: Props) {
  const render = () =>
    PROGRAM_TABS.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        className={cx(styles.button, id === value && styles.active)}>
        {label}
      </button>
    ));

  return <header className={styles.tabs}>{render()}</header>;
}

export { ProgramTabs };
