import { Button } from '@gear-js/ui';
import { StageType } from 'types';
import styles from './ButtonMove.module.scss';

type Props = {
  stage: StageType;
  onRouteChange: (arg: string) => void;
};

function ButtonMove({ stage, onRouteChange }: Props) {
  return (
    <>
      {stage === 'progress' && (
        <Button onClick={() => onRouteChange('move')} text="Make a move" size="large" className={styles.actionButton} />
      )}
      {stage === 'reveal' && (
        <Button onClick={() => onRouteChange('reveal')} text="Reveal" size="large" className={styles.actionButton} />
      )}
    </>
  );
}

export { ButtonMove };
