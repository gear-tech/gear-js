import { Button, Input } from '@gear-js/ui';
import { SelectAccountPopup } from '../../popups/select-account-popup';
import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { isExists } from 'app/utils';
import { Icon } from '../../ui/icon';

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
    <section className="grid grid-rows-[1fr_auto_auto] h-[calc(100vh-196px)]">
      <div className="grow flex flex-col justify-center text-center">
        <img
          className="grow w-full h-30 aspect-[45/56]"
          src="/images/avatar.svg"
          width={448}
          height={560}
          alt="Img"
          loading="lazy"
        />
      </div>
      <div className="mt-12 flex flex-col items-center gap-9">
        <div className="hidden text-center">
          <div className="space-y-6">
            <h2 className="typo-h2 text-primary">Geary</h2>
            <p className="text-[#D1D1D1]">
              {account ? 'Insert program ID to create a character' : 'Connect your account to start the game'}
            </p>
          </div>
          <div>
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
        </div>
        <div className="flex gap-12 items-center w-full p-4 bg-white bg-opacity-[4%] rounded-2xl">
          <div className="max-w-[415px] w-full px-8 py-6 bg-[#1E1E1E] rounded-2xl">
            <h2 className="typo-h2 text-primary">Geary</h2>
            <div className="mt-8 text-white text-lg font-medium">
              <table className="block w-full text-left">
                <tbody className="block space-y-8">
                  <tr className="flex gap-8">
                    <th className="flex-1 w-40 text-white text-opacity-70 font-medium">Owner ID:</th>
                    <td className="flex-1 w-40">Daniel</td>
                  </tr>
                  <tr className="flex gap-8">
                    <th className="flex-1 w-40 text-white text-opacity-70 font-medium">Age:</th>
                    <td className="flex-1 w-40">2 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-6 grow">
            <div className="flex gap-12 items-center">
              <div className="basis-30 grow">
                <div className="w-full">
                  <div className="flex items-center justify-between gap-3 text-base leading-5">
                    <span className="inline-flex gap-2 items-center text-white/70 font-kanit font-medium">
                      <Icon name="food-tray" className="w-5 h-5" /> Hungry:
                    </span>
                    <span>6</span>
                  </div>
                  <div className="relative mt-3 bg-white/15 h-2.5 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-primary" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              <div className="basis-50">
                <button className="btn btn--ghost gap-2 w-full" onClick={openModal}>
                  <Icon name="moon" className="w-5 h-5" /> Sleep
                </button>
              </div>
            </div>
            <div className="flex gap-12 items-center">
              <div className="basis-30 grow">
                <div className="w-full">
                  <div className="flex items-center justify-between gap-3 text-base leading-5">
                    <span className="inline-flex gap-2 items-center text-white/70 font-kanit font-medium">
                      <Icon name="happy" className="w-5 h-5" /> Happy:
                    </span>
                    <span>10</span>
                  </div>
                  <div className="relative mt-3 bg-white/15 h-2.5 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-primary" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
              <div className="basis-50">
                <button className="btn btn--ghost gap-2 w-full" onClick={openModal}>
                  <Icon name="video-game" className="w-5 h-5" /> Play
                </button>
              </div>
            </div>
            <div className="flex gap-12 items-center">
              <div className="basis-30 grow">
                <div className="w-full">
                  <div className="flex items-center justify-between gap-3 text-base leading-5">
                    <span className="inline-flex gap-2 items-center text-white/70 font-kanit font-medium">
                      <Icon name="tired" className="w-5 h-5" /> Tired:
                    </span>
                    <span>8</span>
                  </div>
                  <div className="relative mt-3 bg-white/15 h-2.5 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-primary" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
              <div className="basis-50">
                <button className="btn btn--ghost gap-2 w-full" onClick={openModal}>
                  <Icon name="moon" className="w-5 h-5" /> Sleep
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
