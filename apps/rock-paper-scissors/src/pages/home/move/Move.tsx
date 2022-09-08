import { Button, Input } from '@gear-js/ui';
import clsx from 'clsx';
import { BackButton } from 'components';
import { ReactComponent as RockSVG } from 'assets/images/actions/rock.svg';
import { ReactComponent as PaperSVG } from 'assets/images/actions/paper.svg';
import { ReactComponent as ScissorsSVG } from 'assets/images/actions/scissors.svg';
import { ReactComponent as SpockSVG } from 'assets/images/actions/spock.svg';
import { ReactComponent as LizardSVG } from 'assets/images/actions/lizard.svg';
import styles from './Move.module.scss';

const ACTIONS = [
  { name: 'Rock', SVG: RockSVG },
  { name: 'Spock', SVG: SpockSVG },
  { name: 'Lizard', SVG: LizardSVG },
  { name: 'Paper', SVG: PaperSVG },
  { name: 'Scissors', SVG: ScissorsSVG },
];

type Props = {
  value: string;
};

function Move({ value }: Props) {
  const getActions = () =>
    ACTIONS.map(({ name, SVG }) => {
      const isActive = name === value;

      const className = clsx(styles.action, isActive && styles.active);
      const logoClassName = clsx(styles.logo, isActive && styles.active);

      return (
        <li className={className}>
          <span className={logoClassName}>
            <SVG />
          </span>
          {name}
        </li>
      );
    });

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Move</h2>
      <ul className={styles.actions}>{getActions()}</ul>
      <Input type="password" label="Password" direction="y" />
      <div className={styles.notice}>
        <p>For greater security, use a different password each time, but don`t forget it!</p>
        <p> At the reveal stage you will need to repeat it.</p>
      </div>
      <div className={styles.buttons}>
        <BackButton />
        <Button text="Done" size="large" />
      </div>
    </div>
  );
}

export { Move };
