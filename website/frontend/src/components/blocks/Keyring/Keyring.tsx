import React, { useState, useEffect } from 'react';
import { GearKeyring } from '@gear-js/api';
import Identicon from '@polkadot/react-identicon';

import './Keyring.scss';
import { ReadNotificationsIcon } from "Icons";

const Keyring = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */  
  const [key, setKey] = useState('');
  const [publicKey, setPublicKey] = useState('')
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSeed, setIsSeed] = useState('');
  const [isMnemonic, setIsMnemonic] = useState('');

  useEffect(() => {
    const create = async () => {
        const { mnemonic, seed } = await GearKeyring.generateSeed();
        const { address } = await GearKeyring.fromSeed(seed, 'WebAccount');
        setKey(mnemonic)
        setPublicKey(address);
        setIsSeed(seed);
        setIsMnemonic(mnemonic);
    }

    create();
  },[]);

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(key);
      setCopySuccess(true);
      console.log('Copied!')
    } catch (err) {
      setCopySuccess(false);
    }
  }

  const handleChange = (event: any) => {
  
    if (event.target.value === 'seed'){
      console.log('we are here')
      setKey(isSeed)
    }

    if (event.target.value === 'mnemonic'){
      setKey(isMnemonic)
    }

  }

  return (
      <div className="keyring__wrapper">
          <div className="keyring__address">
            <div className="keyring__icon">
            <Identicon value={publicKey} size={32} theme="polkadot"/>
            </div>
            <div className="keyring__details">{publicKey}</div>
          </div>
          <div className="keyring__content">
            <div className="keyring__help-container">Mnemonic phrase: <span className="keyring__help">?</span></div>
            <div className="keyring__textArea">
              <div className="keyring__key">{key}</div>
              <div className="keyring__copy">
                <div className="keyring__copy-wrapper">
                    <button className="keyring__copy-button" type="button" onClick={copyToClipboard}>
                      <ReadNotificationsIcon color="#ffffff"/>
                    </button>
                </div>
              </div>
              <div className="keyring__key-type">
                <select onChange={handleChange} className="keyring__key-type__btn">
                  <option value="mnemonic">Mnemonic</option>
                  <option value="seed">seed</option>
                </select>  
              </div>
            </div>
            
          </div>    
          <div className="keyring__info">
            <article className="keyring__warning">
              The secret seed value for this account. Ensure that you keep this in a safe place, with access to the seed you can re-create the account.
            </article>
          </div>
      </div>
  )
}

export default Keyring;
