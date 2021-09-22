import React, {useState, useEffect} from 'react';
import { GearKeyring } from '@gear-js/api';

import './Keyring.scss';
import { DropdownArrow, ReadNotificationsIcon } from "Icons";

const Keyring = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */  
  const [secret, setSecret] = useState('');
  const [publicKey, setPublicKey] = useState('')

  useEffect(() => {
    const create = async () => {
        
        const { mnemonic, seed } = await GearKeyring.generateSeed();
        const { address } = await GearKeyring.fromSeed(seed, 'WebAccount');
        setSecret(mnemonic)
        setPublicKey(address);
        
    }

    create();
  },[]) 

  return (
      <div className="keyring__wrapper">
          <div className="keyring__address">
            <div className="keyring__icon">1</div>
            <div className="keyring__details">{publicKey}</div>
          </div>
          <div className="keyring__content">
            <div className="keyring__help-container">Mnemonic phrase: <span className="keyring__help">?</span></div>
            <div className="keyring__textArea">
              <div className="keyring__key">{secret}</div>
              <div className="keyring__copy">
                <div className="keyring__copy-wrapper">
                    <button className="keyring__copy-button" type="button">
                      <ReadNotificationsIcon color="#ffffff"/>
                    </button>
                </div>
              </div>
              <div className="keyring__key-type">
                <button className="keyring__key-type__btn" type="button">
                  <span>Type</span>
                  <DropdownArrow />
                </button>
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
