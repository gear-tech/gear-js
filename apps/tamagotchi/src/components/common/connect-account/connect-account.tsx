import { Button } from '@gear-js/ui';
import { SelectAccountPopup } from 'components/popups/select-account-popup';
import { CreateTamagotchiForm } from 'components/forms/create-tamagotchi-form';
import { useAccount } from '@gear-js/react-hooks';
import { useContext, useState } from 'react';
import { LessonsContext } from '../../../app/context';
import { LoginSection } from '../../sections/login-section';

export const ConnectAccount = () => {
  const { account } = useAccount();

  return (
    <div className="flex flex-col items-center gap-9 text-center w-full">
      <div className="space-y-6">
        <h2 className="typo-h2 text-primary">Geary</h2>
        <p className="text-[#D1D1D1]">
          {account ? 'Insert program ID to create a character' : 'Connect your account to start the game'}
        </p>
      </div>
      <div className=" w-full">{account ? <CreateTamagotchiForm /> : <LoginSection />}</div>
    </div>
  );
};
