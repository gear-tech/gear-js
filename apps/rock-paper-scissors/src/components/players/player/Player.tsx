import { Hex } from '@gear-js/api';
import { Checkbox } from '@gear-js/ui';
import styles from '../Players.module.scss';

type PlayerProps = { isFinished: boolean; id: Hex };

function Player({ isFinished, id }: PlayerProps) {
  return (
    <li key={id} className={styles.row}>
      <span className={styles.player}>{id}</span>
      <Checkbox disabled checked={isFinished} label="" className={styles.checkbox} readOnly />
    </li>
  );
}

export { Player };
