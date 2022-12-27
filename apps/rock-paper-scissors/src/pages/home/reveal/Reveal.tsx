import { useState } from 'react';
import { Button, Input } from '@gear-js/ui';
import { ActionButton, BackButton } from 'components';
import { AnyJson, SendMessageOptions, UserMoveType } from 'types';
import { onSubmitReveal } from 'utils';
import styles from './Reveal.module.scss';

type Props = {
  userMove: UserMoveType;
  payloadSend: (payload: AnyJson, options?: SendMessageOptions  | undefined) => void;
  onRouteChange: (arg: string) => void;
};

function Reveal({ userMove, payloadSend, onRouteChange }: Props) {
  const [passwordValue, setPasswordvalue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setPasswordvalue(e.target.value);

  const handleSubmit = () => {
    onSubmitReveal(onRouteChange, payloadSend, userMove.id, passwordValue);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Reveal</h2>
      <div className={styles.box}>
        <Input type="password" label="Password" direction="y" className={styles.input} onChange={handleChange} />
        <ActionButton name={userMove?.name} SVG={userMove?.SVG} isActive onClick={() => {}} />
      </div>
      <div className={styles.buttons}>
        <BackButton onClick={() => onRouteChange('game')} />
        <Button onClick={handleSubmit} text="Done" size="large" />
      </div>
    </div>
  );
}

export { Reveal };
