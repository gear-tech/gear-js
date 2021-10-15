import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RPC_METHODS } from 'consts';
import { GearKeyring } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import Identicon from '@polkadot/react-identicon';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import { copyToClipboard } from 'helpers';
import './Keyring.scss';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { CopyClipboard } from '../../../assets/Icons';

type Props = {
  handleClose: () => void;
};

export const Keyring = ({ handleClose }: Props) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [key, setKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [isSeed, setIsSeed] = useState('');
  const [isMnemonic, setIsMnemonic] = useState('');
  const [saved, setSaved] = useState(false);
  const [keyPairJson, setKeyPairJson] = useState<any>(null);
  const [keyPair, setKeyPair] = useState<any>(null);
  const [isAddressRaw, setIsAddressRaw] = useState('');

  const apiRequest = new ServerRPCRequestService();
  const alert = useAlert();

  useEffect(() => {
    const create = async () => {
      const {
        mnemonic,
        seed,
        json,
        json: { address },
        keyring: { addressRaw },
        keyring,
      } = await GearKeyring.create('WebAccount');
      setKey(mnemonic);
      setPublicKey(address);
      setIsSeed(seed);
      setIsMnemonic(mnemonic);
      setKeyPairJson(json);
      setIsAddressRaw(u8aToHex(addressRaw));
      setKeyPair(keyring);
    };

    create();
  }, []);

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

  const handleCreate = (password: string) => {
    const encodedJson = GearKeyring.toJson(keyPair, `${password}`);
    localStorage.setItem('gear_mnemonic', JSON.stringify(keyPairJson));
    localStorage.setItem('public_key', publicKey);
    downloadJson(JSON.stringify(encodedJson), `keystore_${keyPairJson.meta.name}.json`, 'text/plain');

    apiRequest.getResource(RPC_METHODS.ADD_PUBLIC, {
      publickKeyRaw: isAddressRaw,
      publickKey: publicKey,
    });
    localStorage.setItem('public_key_raw', isAddressRaw);
    handleClose();
  };

  const Schema = Yup.object({
    password: Yup.string().required('Password is required'),
    confirmpassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

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
              <button
                className="keyring__copy-button"
                type="button"
                onClick={() => copyToClipboard(key, alert, 'Copied')}
              >
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
        <Formik
          initialValues={{
            password: '',
            confirmpassword: '',
          }}
          validationSchema={Schema}
          onSubmit={() => {}}
        >
          {({ values, errors, isValid = false, touched }) => (
            <Form id="password-form">
              <div className="password--wrapper">
                <div className="password-form--col">
                  <div className="password-form--info">
                    <label htmlFor="passowrd" className="password-form__field">
                      Password:
                    </label>
                    <div className="password-form__field-wrapper">
                      <Field type="password" name="password" id="password" />
                      {errors.password && touched.password ? (
                        <div className="password-form__error">{errors.password}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="password-form--info">
                    <label htmlFor="passowrd" className="password-form__field">
                      Repeat:{' '}
                    </label>
                    <div className="password-form__field-wrapper">
                      <Field type="password" name="confirmpassword" id="confirmpassword" />
                      {errors.confirmpassword && touched.confirmpassword ? (
                        <div className="password-form__error">{errors.confirmpassword}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="keyring__saveToggle">
                    <input
                      type="checkbox"
                      className="keyring__saveToggle-checkbox"
                      checked={saved}
                      onChange={() => setSaved(!saved)}
                    />
                    <span>I have saved my mnemonic seed safely</span>
                  </div>
                  <button
                    className="keyring__action-btn"
                    type="button"
                    disabled={!saved}
                    onClick={() => {
                      if (isValid) {
                        handleCreate(values.password);
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
