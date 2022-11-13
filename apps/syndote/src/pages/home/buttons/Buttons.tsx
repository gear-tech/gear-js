import { Button } from '@gear-js/ui';
import { ReactComponent as PlaySVG } from 'assets/images/buttons/play.svg';
import { ReactComponent as PauseSVG } from 'assets/images/buttons/pause.svg';
import { ReactComponent as NextSVG } from 'assets/images/buttons/next.svg';
import { ReactComponent as LastSVG } from 'assets/images/buttons/last.svg';
import styles from './Buttons.module.scss';

type Props = {
  onFirstClick?: () => void;
  onPrevClick?: () => void;
  onMainClick?: () => void;
  onNextClick?: () => void;
  onLastClick?: () => void;
  isPauseButton?: boolean;
};

function Buttons({ onFirstClick, onPrevClick, onMainClick, onNextClick, onLastClick, isPauseButton }: Props) {
  return (
    <div>
      {onFirstClick && (
        <Button icon={LastSVG} color="transparent" className={styles.backButton} onClick={onFirstClick} />
      )}

      <div className={styles.mainButtons}>
        {onPrevClick && (
          <Button icon={NextSVG} color="transparent" className={styles.backButton} onClick={onPrevClick} />
        )}
        {onMainClick && (
          <Button icon={isPauseButton ? PauseSVG : PlaySVG} className={styles.button} onClick={onMainClick} />
        )}
        {onNextClick && <Button icon={NextSVG} color="transparent" onClick={onNextClick} />}
      </div>

      {onLastClick && <Button icon={LastSVG} color="transparent" onClick={onLastClick} />}
    </div>
  );
}

export { Buttons };
