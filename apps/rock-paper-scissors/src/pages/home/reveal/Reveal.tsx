import { useState } from 'react';
import { Button, Input } from '@gear-js/ui';
import { ActionButton, BackButton } from 'components';
import { SVGType } from 'types';
import styles from './Reveal.module.scss';

type Props = {
  move: { name: string; SVG?: SVGType; id?: string };
  onClickMove: (attr: string, pass: string) => void;
  onRouteChange: (arg: string) => void;
};

function Reveal({ move, onClickMove, onRouteChange }: Props) {
  
  const [passwordValue, setPasswordvalue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setPasswordvalue(e.target.value);

  const handleSubmit = () => {
    if (move.id && passwordValue) { onClickMove(move.id, passwordValue) }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Reveal</h2>
      <div className={styles.box}>
        <Input type="password" label="Password" direction="y" className={styles.input} onChange={handleChange} />
        {move?.name && <ActionButton name={move?.name} SVG={move?.SVG} isActive onClick={()=>{}}  />}
      </div>
      <div className={styles.buttons}>
        <BackButton onClick={() => onRouteChange('game')} />
        <Button onClick={handleSubmit} text="Done" size="large" />
      </div>
    </div>
  );
}

export { Reveal };
