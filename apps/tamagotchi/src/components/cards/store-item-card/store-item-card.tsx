import { Icon } from 'components/ui/icon';
import { Button } from '@gear-js/ui';
import { PaymentErrorPopup } from 'components/popups/payment-error-popup';
import { useState } from 'react';

export const StoreItemCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <article className="">
      <div className="flex flex-col py-10 px-8 bg-white/5 aspect-[347/230] rounded-2xl">
        <h2 className="mt-auto text-center font-kanit font-semibold text-xl tracking-[0.04em]">Item title</h2>
      </div>
      <div className="flex items-center justify-between gap-5 mt-4">
        <p className="flex gap-2 items-center text-primary">
          <Icon name="money" className="w-5 h-5" />
          <span className="text-xxs font-medium">
            <strong className="font-kanit font-medium text-[20px] leading-6">1.34</strong> MUnits
          </span>
        </p>

        <Button
          className="gap-2 !py-2.5"
          color="lightGreen"
          text="Buy"
          icon={() => <Icon name="cart" className="w-4 h-4" />}
          onClick={() => setOpen(true)}
        />
      </div>
      {open && <PaymentErrorPopup close={() => setOpen(false)} />}
    </article>
  );
};
