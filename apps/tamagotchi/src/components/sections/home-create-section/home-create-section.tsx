import { Button, Input } from '@gear-js/ui';
import { SelectAccountPopup } from '../../popups/select-account-popup';
import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { isExists } from 'app/utils';

const initialValues = {
  gameName: '',
};

const validate = {
  gameName: isExists,
};
export const HomeCreateSection = () => {
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;
  const handleSubmit = form.onSubmit((values) => {
    console.log('submitted');
  });

  const { account, accounts } = useAccount();
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <section className="grid grid-rows-[1fr_auto_auto] h-[calc(100vh-196px)] text-center">
      <div className="grow flex flex-col justify-center">
        <img
          className="grow w-full h-30 aspect-[45/56]"
          src="/images/avatar.svg"
          width={448}
          height={560}
          alt="Img"
          loading="lazy"
        />
      </div>
      <div className="mt-12 space-y-6">
        <h2 className="typo-h2 text-primary">Geary</h2>
        <p className="text-[#D1D1D1]">
          {account ? 'Insert program ID to create a character' : 'Connect your account to start the game'}
        </p>
      </div>
      <div className="mt-9">
        {account ? (
          <form onSubmit={handleSubmit} className="flex items-center justify-center gap-6">
            <div className="basis-[400px]">
              <Input placeholder="Insert program ID" direction="y" {...getInputProps('gameName')} />
            </div>
            <div className="">
              <Button text="Create Tamagochi" color="primary" onClick={openModal} />
            </div>
          </form>
        ) : (
          <>
            <Button text="Connect account" color="primary" onClick={openModal} />
            {open && <SelectAccountPopup accounts={accounts} close={closeModal} />}
          </>
        )}
      </div>
    </section>
  );
};
