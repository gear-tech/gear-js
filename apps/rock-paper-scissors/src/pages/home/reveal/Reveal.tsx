import { Button, Input } from '@gear-js/ui';
import { ActionButton, BackButton } from 'components';
import { SVGType } from 'types';
import styles from './Reveal.module.scss';

type Props = {
  move: { name: string; SVG: SVGType };
};

function Reveal({ move }: Props) {
  const { name, SVG } = move;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Reveal</h2>
      <div className={styles.box}>
        <Input type="password" label="Password" direction="y" className={styles.input} />
        <ActionButton name={name} SVG={SVG} isActive />
      </div>
      <div className={styles.buttons}>
        <BackButton />
        <Button text="Done" size="large" />
      </div>
    </div>
  );
}

export { Reveal };
