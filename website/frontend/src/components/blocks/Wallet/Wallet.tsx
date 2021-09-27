import React, { useEffect, useState } from 'react';
import { toShortAddress } from '../../../helpers';

import './Wallet.scss';

export const Wallet = () => {
  const [address, setAddress] = useState('');

  useEffect(() => {
    const publicKey: any = localStorage.getItem('public_key');
    setAddress(publicKey);
  }, []);

  return (
    <div className="user-wallet__wrapper">
      <div className="user-wallet__address">{toShortAddress(address)}</div>
    </div>
  );
};
