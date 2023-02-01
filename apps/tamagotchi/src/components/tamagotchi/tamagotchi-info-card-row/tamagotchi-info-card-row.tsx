import { Icon } from '../../ui/icon';
import { Button } from '@gear-js/ui';
import clsx from 'clsx';

type Props = {
  onClick: () => void;
  label: string;
  value: number;
  icon: string;
  labelBtn: string;
};
export const TamagotchiInfoCardRow = ({ label, labelBtn, value, icon, onClick }: Props) => {
  const current = Number(value) / 100;
  return (
    <div className="flex gap-12 items-center">
      <div className="basis-30 grow">
        <div className="w-full">
          <div className="flex items-center justify-between gap-3 text-base leading-5">
            <span className="inline-flex gap-2 items-center text-white/70 font-kanit font-medium">
              <Icon name={icon} className="w-5 h-5" /> {label}:
            </span>
            <span>{Math.round(current) / 10}</span>
          </div>
          <div className="relative mt-3 bg-white/15 h-2.5 rounded-full overflow-hidden">
            <div
              className={clsx(
                'absolute inset-0 rounded-full',
                current > 60 ? 'bg-primary' : current > 40 ? 'bg-amber-500' : 'bg-error',
              )}
              style={{ width: `${current}%` }}
            />
          </div>
        </div>
      </div>
      <div className="basis-50">
        <Button
          color="light"
          className="gap-2 w-full"
          text={labelBtn}
          icon={() => <Icon name={`act-${labelBtn.toLowerCase()}`} className="w-5 h-5" />}
          onClick={onClick}
        />
      </div>
    </div>
  );
};
