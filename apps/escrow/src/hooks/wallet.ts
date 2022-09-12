import { UserMessageSent, CreateType } from '@gear-js/api';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { UnsubscribePromise } from '@polkadot/api/types';
import { u8, Vec } from '@polkadot/types';
import { useEffect, useState } from 'react';
import isPlainObject from 'lodash.isplainobject';
import { LOCAL_STORAGE } from 'consts';
import { getProgramId } from 'utils';
import { useWasm } from './context';

const initWalletId = (localStorage[LOCAL_STORAGE.WALLET] as string) || '';

function useWalletId() {
  const { api } = useApi();

  const { account } = useAccount();
  const decodedAddress = account?.decodedAddress;

  const { meta } = useWasm();

  const [walletId, setWalletId] = useState(initWalletId);

  const resetWalletId = () => setWalletId('');

  const getDecodedPayload = (payload: Vec<u8>) => {
    // handle_output is specific for escrow contract
    if (meta.handle_output) {
      return new CreateType().create(meta.handle_output, payload, meta).toHuman();
    }
  };

  const getWalletId = (payload: Vec<u8>) => {
    const decodedPayload = getDecodedPayload(payload);
    const isWalletCreated = Object.prototype.hasOwnProperty.call(decodedPayload, 'Created');

    if (isPlainObject(decodedPayload) && isWalletCreated)
      // @ts-ignore
      return decodedPayload.Created as string;
  };

  const handleEvents = ({ data }: UserMessageSent) => {
    const { message } = data;
    const { destination, source, payload } = message;
    const isOwner = destination.toHex() === account?.decodedAddress;
    const isEscrowProgram = source.toHex() === getProgramId();

    if (isOwner && isEscrowProgram) {
      const id = getWalletId(payload);
      if (id) setWalletId(id);
    }
  };

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api && decodedAddress) {
      unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', handleEvents);
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, decodedAddress]);

  return { walletId, setWalletId, resetWalletId };
}

export { useWalletId };
