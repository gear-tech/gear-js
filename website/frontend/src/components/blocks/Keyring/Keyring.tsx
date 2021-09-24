import React, { useState, useEffect } from 'react';
import { GearKeyring } from '@gear-js/api';
import Identicon from '@polkadot/react-identicon';

import './Keyring.scss';
import { ReadNotificationsIcon } from "Icons";
import StatusPanel from 'components/blocks/StatusPanel';

type Props = {
  handleClose: () => void;
}

export const Keyring = ({ handleClose }: Props) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */  
  const [key, setKey] = useState('');
  const [publicKey, setPublicKey] = useState('')
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSeed, setIsSeed] = useState('');
  const [isMnemonic, setIsMnemonic] = useState('');
  const [saved, setSaved] = useState(false);
  const [isJson, setIsJson] = useState<any>(null);

  if (copySuccess) {
    setTimeout(() => setCopySuccess(false), 3000);
  }

  useEffect(() => {
    const create = async () => {
        const { mnemonic, seed, json } = await GearKeyring.create('name');
        const { address } = await GearKeyring.fromSeed(seed, 'WebAccount');
        setKey(mnemonic)
        setPublicKey(address);
        setIsSeed(seed);
        setIsMnemonic(mnemonic);
        setIsJson(json);
    }

    create();
  },[]);

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(key);
      setCopySuccess(true);
    } catch (err) {
      setCopySuccess(false);
    }
  }

  const handleChange = (event: any) => {
  
    if (event.target.value === 'seed'){
      setKey(isSeed);
    }

    if (event.target.value === 'mnemonic'){
      setKey(isMnemonic);
    }

  }

  const handleCreate = () => {
    localStorage.setItem('gear_mnemonic', JSON.stringify(isJson));
    localStorage.setItem('public_key', publicKey);
    handleClose();
  }
  
  // const downloadJson = (content: object, fileName: string , contentType: string) => void {
  //   const a = document.createElement('a');
  //   const file: any = new Blob([content], { type: contentType });
  //   a.href = URL.createObjectURL(file);
  //   a.download = fileName;
  //   a.click();
  // }


  return (
      <div className="keyring__wrapper">
          <div className="keyring__address">
            <div className="keyring__icon">
            <Identicon value={publicKey} size={32} theme="polkadot"/>
            </div>
            <div className="keyring__details">{publicKey}</div>
          </div>
          <div className="keyring__content">
            <div className="keyring__help-container">Mnemonic phrase or seed: <span className="keyring__help">?</span></div>
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
            <div className="keyring__saveToggle">
              <input type="checkbox" className="keyring__saveToggle-checkbox" checked={saved} onChange={() => setSaved(!saved)} />
              <span>I have saved my mnemonic seed safely</span>
            </div>
          </div>
          <div className="keyring__action-bar">
            <button className="keyring__action-btn" type="button" disabled={!saved} onClick={handleCreate}>Add</button>
          </div>
          {copySuccess && (
            <StatusPanel
              onClose={() => {
                setCopySuccess(false);
              }}
              statusPanelText="Copied!"
            />
          )}
      </div>
  )
}


