import { Icon } from '../../ui/icon';
import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { Popover } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import { useEffect, useState } from 'react';

type Props = {
  onClick: () => void;
  label: string;
  value: number;
  icon: string;
  labelBtn: string;
  tooltipTitle: string;
  tooltipText: string;
  isActive: boolean;
  isPending: boolean;
};

export const TamagotchiInfoCardRow = ({
  label,
  labelBtn,
  value,
  icon,
  onClick,
  tooltipTitle,
  tooltipText,
  isActive,
  isPending,
}: Props) => {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);
  const current = Number(value) / 100;

  useEffect(() => {
    setShow(isActive);
    // console.log({ isActive });
  }, [isActive]);

  return (
    <Popover>
      <Float
        placement="left"
        offset={28}
        shift={16}
        flip={50}
        show={show}
        arrow
        portal
        enter="transition duration-200 ease-out"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition duration-150 ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1">
        <div className="flex gap-12 items-center">
          <div className="basis-30 grow">
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
          <div className="basis-50">
            <Button
              color={isActive ? 'primary' : 'light'}
              className={clsx(
                'gap-2 w-full',
                isActive &&
                  'relative before:absolute before:-inset-1 before:border before:border-primary/40 before:rounded-[90px] before:animate-wave-2 after:absolute after:-inset-2 after:border after:border-primary/20 after:rounded-[90px] after:animate-wave',
              )}
              text={labelBtn}
              icon={() => <Icon name={`act-${labelBtn.toLowerCase()}`} className="w-5 h-5" />}
              onClick={onClick}
              disabled={isPending}
            />
          </div>
        </div>

        <Popover.Panel className="bg-dark-500 border border-[#2A7D4E] rounded-[20px] shadow-lg focus:outline-none">
          <Float.Arrow offset={8} className="absolute rotate-45 border-8 border-[#2A7D4E]" />

          <div className="relative h-full py-6 pl-8 pr-16 bg-dark-500 rounded-[20px]">
            <h3 className="font-kanit font-semibold text-xl">{tooltipTitle}</h3>
            <div className="mt-2 text-light max-w-[300px]">
              <p>{tooltipText}</p>
            </div>
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              onClick={toggle}>
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
        </Popover.Panel>
      </Float>
    </Popover>
  );
};
