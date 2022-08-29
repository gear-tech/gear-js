import { TooltipWrapper } from '../utils';
import styles from './Tooltip.module.scss';

type Props = {
  text: string;
  className?: string;
};

function Tooltip({ text, className }: Props) {
  return (
    <TooltipWrapper text={text} className={className}>
      <span className={styles.tooltip} data-testid="tooltipIcon" />
    </TooltipWrapper>
  );
}

export { Tooltip };
