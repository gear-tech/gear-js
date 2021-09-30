import React, { useState, useEffect } from 'react';
import { RPC_METHODS } from 'consts';
import { GearKeyring } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import Identicon from '@polkadot/react-identicon';

import './Keyring.scss';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { CopyClipboard } from '../../../assets/Icons';
import { StatusPanel } from '../StatusPanel/StatusPanel';

type Props = {
  handleClose: () => void;
};

export const Keyring = ({ handleClose }: Props) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [key, setKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSeed, setIsSeed] = useState('');
  const [isMnemonic, setIsMnemonic] = useState('');
  const [saved, setSaved] = useState(false);
  const [keyPairJson, setKeyPairJson] = useState<any>(null);
  const [isAddressRaw, setIsAddressRaw] = useState('');

  const apiRequest = new ServerRPCRequestService();

  if (copySuccess) {
    setTimeout(() => setCopySuccess(false), 3000);
  }

  useEffect(() => {
    const create = async () => {
      const { mnemonic, seed, json, json: { address }, keyring : {addressRaw} } = await GearKeyring.create('WebAccount');
      setKey(mnemonic);
      setPublicKey(address);
      setIsSeed(seed);
      setIsMnemonic(mnemonic);
      setKeyPairJson(json);
      setIsAddressRaw(u8aToHex(addressRaw));
    };

    create();
  }, []);

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(key);
      setCopySuccess(true);
    } catch (err) {
      setCopySuccess(false);
    }
  };

  const downloadJson = (content: any, fileName: string, contentType: string) => {
    const link: HTMLAnchorElement = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
  };

  const handleChange = (event: any) => {
    if (event.target.value === 'seed') {
      setKey(isSeed);
    }

    if (event.target.value === 'mnemonic') {
      setKey(isMnemonic);
    }
  };

  const handleCreate = () => {
    localStorage.setItem('gear_mnemonic', JSON.stringify(keyPairJson));
    localStorage.setItem('public_key', publicKey);
    downloadJson(JSON.stringify(keyPairJson), `keystore_${keyPairJson.meta.name}.json`, 'text/plain');
    
    apiRequest.getResource(RPC_METHODS.ADD_PUBLIC, {
      publickKeyRaw: isAddressRaw,
      publickKey: publicKey
    });
    localStorage.setItem('address_raw', isAddressRaw);
    handleClose();
  };

  return (
    <div className="keyring__wrapper">
      <div className="keyring__address">
        <div className="keyring__icon">
          <Identicon value={publicKey} size={32} theme="polkadot" />
        </div>
        <div className="keyring__details">{publicKey}</div>
      </div>
      <div className="keyring__content">
        <div className="keyring__help-container">
          Mnemonic phrase or seed: <span className="keyring__help">?</span>
        </div>
        <div className="keyring__textArea">
          <div className="keyring__key">{key}</div>
          <div className="keyring__copy">
            <div className="keyring__copy-wrapper">
              <button className="keyring__copy-button" type="button" onClick={copyToClipboard}>
                <CopyClipboard color="#ffffff" />
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
          The secret seed value for this account. Ensure that you keep this in a safe place, with access to the seed you
          can re-create the account.
        </article>
        <div className="keyring__saveToggle">
          <input
            type="checkbox"
            className="keyring__saveToggle-checkbox"
            checked={saved}
            onChange={() => setSaved(!saved)}
          />
          <span>I have saved my mnemonic seed safely</span>
        </div>
      </div>
      <div className="keyring__action-bar">
        <button className="keyring__action-btn" type="button" disabled={!saved} onClick={handleCreate}>
          Add
        </button>
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
  );
};
