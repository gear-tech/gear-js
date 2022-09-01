import { Button } from '@gear-js/ui';
import create from 'assets/images/icons/create.svg';
import { Games } from './games';
import styles from './Start.module.scss';

const games = [
  { name: 'name', players: '0/10', bet: '10', game: '1', round: '2', stage: 'reveal', action: '' },
  { name: 'name', players: '0/10', bet: '10', game: '1', round: '2', stage: 'progress', action: '' },
  { name: 'name', players: '0/10', bet: '10', game: '1', round: '2', stage: 'preparation', action: '' },
  { name: 'name', players: '0/10', bet: '10', game: '1', round: '2', stage: 'reveal', action: '' },
  { name: 'name', players: '0/10', bet: '10', game: '1', round: '2', stage: 'reveal', action: '' },
  { name: 'name', players: '0/10', bet: '10', game: '1', round: '2', stage: 'reveal', action: '' },
  { name: 'name', players: '0/10', bet: '10', game: '1', round: '2', stage: 'reveal', action: '' },
];

function Start() {
  return (
    <>
      <h2 className={styles.heading}>Rock Paper Scissors Lizard Spock</h2>
      <Button icon={create} text="Create new game" size="large" className={styles.button} />
      <Games heading="Games" list={[]} />
      <Games heading="My games" list={games} />
    </>
  );
}

export { Start };
