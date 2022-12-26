import { useState } from 'react';
import { Button, Input } from '@gear-js/ui';
import { onSubmitMove } from 'utils';
import { ActionButton, BackButton } from 'components';
import { UserMoveType } from 'types';
import { ReactComponent as RockSVG } from 'assets/images/actions/rock.svg';
import { ReactComponent as PaperSVG } from 'assets/images/actions/paper.svg';
import { ReactComponent as ScissorsSVG } from 'assets/images/actions/scissors.svg';
import { ReactComponent as SpockSVG } from 'assets/images/actions/spock.svg';
import { ReactComponent as LizardSVG } from 'assets/images/actions/lizard.svg';
import styles from './Move.module.scss';

const ACTIONS = [
  { name: 'Rock', SVG: RockSVG, id: '0' },
  { name: 'Paper', SVG: PaperSVG, id: '1' },
  { name: 'Scissors', SVG: ScissorsSVG, id: '2' },
  { name: 'Lizard', SVG: LizardSVG, id: '3' },
  { name: 'Spock', SVG: SpockSVG, id: '4' },
];

type Props = {
  onRouteChange: (arg: string) => void;
  setUserMove: (arg: UserMoveType) => void;
  payloadSend: any;
  userMove: UserMoveType;
};

function Move({ payloadSend, onRouteChange, setUserMove, userMove }: Props) {
  const [passwordValue, setPasswordValue] = useState('');

  const handleSubmitMove = () => {
    onSubmitMove(onRouteChange, payloadSend, userMove, passwordValue);
    setUserMove(userMove);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setPasswordValue(e.target.value);

  const getActions = () =>
    ACTIONS.map((el) => (
      <li key={el.name}>
        <ActionButton
          name={el.name}
          SVG={el.SVG}
          isActive={el.name === userMove.name}
          onClick={() => setUserMove(el)}
        />
      </li>
    ));

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Move</h2>
      <ul className={styles.actions}>{getActions()}</ul>
      <Input className={styles.inputPassword} onChange={handleChange} type="password" label="Password" direction="y" />
      <div className={styles.notice}>
        <p>For greater security, use a different password each time, but don`t forget it!</p>
        <p> At the reveal stage you will need to repeat it.</p>
      </div>
      <div className={styles.buttons}>
        <BackButton onClick={() => onRouteChange('game')} />
        <Button onClick={handleSubmitMove} text="Done" size="large" />
      </div>
    </div>
  );
}

export { Move };
