import { UserMessageSent, CreateType } from '@gear-js/api';
import { useAccount, useApi, useMetadata } from '@gear-js/react-hooks';
import { UnsubscribePromise } from '@polkadot/api/types';
import { u8, Vec } from '@polkadot/types';
import isPlainObject from 'lodash.isplainobject';
import escrowMetaWasm from 'assets/wasm/escrow.meta.wasm';
import { ADDRESS } from 'consts';
import { useEffect, useState } from 'react';

function useWalletId() {
  const { api } = useApi();

  const { account } = useAccount();
  const decodedAddress = account?.decodedAddress;

  const { metadata } = useMetadata(escrowMetaWasm);

  const [walletId, setWalletId] = useState('');

  const getDecodedPayload = (payload: Vec<u8>) => {
    // handle_output is specific for escrow contract
    if (metadata && metadata.handle_output) {
      return new CreateType().create(metadata.handle_output, payload, metadata).toHuman();
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
    const isEscrowProgram = source.toHex() === ADDRESS.ESCROW_CONTRACT;

    if (isOwner && isEscrowProgram) {
      const id = getWalletId(payload);
      if (id) setWalletId(id);
    }
  };

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api && decodedAddress && metadata) {
      unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', handleEvents);
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, decodedAddress, metadata]);

  return { walletId, setWalletId };
}

export { useWalletId };
