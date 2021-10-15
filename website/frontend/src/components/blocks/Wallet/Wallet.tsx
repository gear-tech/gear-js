import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { toShortAddress, copyToClipboard } from '../../../helpers';

import './Wallet.scss';

export const Wallet = () => {
  const [address, setAddress] = useState('');

  const alert = useAlert();

  useEffect(() => {
    const publicKey: any = localStorage.getItem('public_key');
    setAddress(publicKey);
  }, [address]);

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */

  return (
    <div className="user-wallet__wrapper">
      <div
        className="user-wallet__address"
        role="button"
        tabIndex={0}
        onClick={() => copyToClipboard(address, alert, 'Account ID copied')}
      >
        {toShortAddress(address)}
      </div>
    </div>
  );
};
