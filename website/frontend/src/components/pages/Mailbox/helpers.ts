import { Dispatch, SetStateAction } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Hex } from '@gear-js/api';
import { AddAlert } from 'store/actions/actions';
import { EventTypes } from 'types/alerts';
import { UserAccount } from 'types/account';
import { Mail } from './types';

export const getMails = async (api: any, publicKey: Hex, setMails: Dispatch<SetStateAction<Mail[]>>) => {
  try {
    await api.mailbox.subscribe(publicKey, (data: any) => {
      const mailsHuman = data.toHuman();
      const mailsArray: Mail[] = [];

      for (const key in mailsHuman) {
        mailsArray.push(mailsHuman[key]);
      }

      setMails(mailsArray);
    });
  } catch (error) {
    console.log(error);
  }
};

export const claimValue = async (api: any, currentAccount: UserAccount, elem: Mail, dispatch: Dispatch<any>) => {
  try {
    const injector = await web3FromSource(currentAccount.meta.source);

    await api.claimValueFromMailbox.submit(elem.id);
    await api.claimValueFromMailbox.signAndSend(currentAccount.address, { signer: injector.signer }, (data: any) => {
      dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Status: ${data.status}` }));
    });
  } catch (error) {
    console.error(error);
  }
};
