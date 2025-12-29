import { Button } from '@gear-js/ui';
import { HTMLAttributes } from 'react';

import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';

import styles from './picker.module.scss';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 2023;
const YEARS = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);

function HeaderButton({ text, onClick }: { text: string; onClick: () => void }) {
  return <Button text={text} color="transparent" className={styles.headerButton} onClick={onClick} noLetterSpacing />;
}

function PrevButton({ ...props }: HTMLAttributes<HTMLButtonElement>) {
  return <Button {...props} icon={ArrowSVG} color="transparent" className={styles.prevButton} />;
}

function NextButton({ ...props }: HTMLAttributes<HTMLButtonElement>) {
  return <Button {...props} icon={ArrowSVG} color="transparent" className={styles.nextButton} />;
}

type MonthPickerProps = {
  currentYear: number;
  onClick: (index: number) => void;
  onYearClick: () => void;
  onNavigateYearClick: (delta: number) => void;
  onBackClick: () => void;
};

function MonthPicker({ currentYear, onClick, onYearClick, onNavigateYearClick, onBackClick }: MonthPickerProps) {
  const render = () =>
    MONTHS.map((item, index) => (
      <button key={item} type="button" className={styles.button} onClick={() => onClick(index)}>
        {item}
      </button>
    ));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {currentYear > START_YEAR && <PrevButton onClick={() => onNavigateYearClick(-1)} />}

        <HeaderButton text={currentYear.toString()} onClick={() => onYearClick()} />

        {currentYear < CURRENT_YEAR && <NextButton onClick={() => onNavigateYearClick(1)} />}
      </header>

      <div className={styles.body}>{render()}</div>

      <Button text="Back" size="small" color="light" onClick={onBackClick} block />
    </div>
  );
}

type YearPickerProps = {
  onClick: (year: number) => void;
  onBackClick: () => void;
};

function YearPicker({ onClick, onBackClick }: YearPickerProps) {
  const render = () =>
    YEARS.map((item) => (
      <button key={item} type="button" className={styles.button} onClick={() => onClick(item)}>
        {item}
      </button>
    ));

  return (
    <div className={styles.container}>
      <header className={styles.header}>Select Year</header>
      <div className={styles.body}>{render()}</div>

      <Button text="Back" size="small" color="light" onClick={onBackClick} block />
    </div>
  );
}

export { HeaderButton, NextButton, PrevButton, MonthPicker, YearPicker };
