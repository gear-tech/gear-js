import { GearKeyring } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { KeyringPair$Json, KeyringPair } from '@polkadot/keyring/types';
import { useState, useEffect } from 'react';

function useRandomPairOr(storagePair: KeyringPair$Json | undefined) {
  const alert = useAlert();

  const [pair, setPair] = useState<KeyringPair$Json | KeyringPair | undefined>(storagePair);

  useEffect(() => {
    if (pair) return;

    GearKeyring.create('signlessPair')
      .then(({ keyring }) => setPair(keyring))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return pair;
}

export { useRandomPairOr };
