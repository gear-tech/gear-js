import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { RPC_METHODS, KEY_TYPES } from 'consts';
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
  const [publicKey, setPublicKey] = useState('');
  const [seedType, setSeedType] = useState('mnemonic');
  const [isSeed, setIsSeed] = useState('');
  const [isMnemonic, setIsMnemonic] = useState('');
  const [accountName, setAccountName] = useState('New Account');
  const [saved, setSaved] = useState(false);
  const [isError, setIsError] = useState(false);

  const apiRequest = new ServerRPCRequestService();
  const alert = useAlert();
  const create = async () => {
    // it returns new generated seed and mnemonic
    const { seed, mnemonic } = await GearKeyring.generateSeed();

    // get Address from seed
    const { address } = await GearKeyring.fromSeed(seed);

    setIsSeed(seed);
    setIsMnemonic(mnemonic);
    setPublicKey(address);
    setIsError(false);
  };

  useEffect(() => {
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
    create();

    if (event.target.value === 'seed') {
      setSeedType(KEY_TYPES.RAW);
    }

    if (event.target.value === 'mnemonic') {
      setSeedType(KEY_TYPES.MNEMOINIC);
    }
  };

  const updateAddress = async (seed: string) => {
    if (seedType === 'raw') {
      try {
        const { address } = await GearKeyring.fromSeed(seed);
        setIsSeed(seed);
        setPublicKey(address);
        setIsError(false);
      } catch (error) {
        setPublicKey(`5${Array(42).join('x')}`);
        setIsError(true);
      }
    } else {
      try {
        const { address } = await GearKeyring.fromMnemonic(seed);
        setIsMnemonic(seed);
        setPublicKey(address);
        setIsError(false);
      } catch (error) {
        setPublicKey(`5${Array(42).join('x')}`);
        setIsError(true);
      }
    }
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(event.target.value);
  };

  const onChangeSeed = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (seedType === 'mnemonic') {
      setIsMnemonic(event.target.value);
    } else {
      setIsSeed(event.target.value);
    }

    updateAddress(event.target.value);
  };

  const handleCreate = async (password: string) => {
    let keyring;

    if (seedType === 'mnemonic') {
      keyring = await GearKeyring.fromMnemonic(isMnemonic, accountName);
    } else {
      keyring = await GearKeyring.fromSeed(isSeed, accountName);
    }
    const keyPairJson = await GearKeyring.toJson(keyring);
    const encodedJson = await GearKeyring.toJson(keyring, `${password}`);
    const isAddressRaw = u8aToHex(keyring.addressRaw);

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
      <input
        id="accountName"
        className="keyring__name"
        type="text"
        name="accoutName"
        value={accountName}
        onChange={(event) => onChangeName(event)}
      />
      <div className="keyring__address">
        <div className="keyring__icon">
          <Identicon value={publicKey} size={32} theme="polkadot" />
        </div>
        <div className="keyring__details">{publicKey}</div>
      </div>
      <div className="keyring__content">
        <div className="keyring__help-container">Mnemonic phrase or seed:</div>
        <div className="keyring__textArea">
          <textarea
            autoCapitalize="off"
            autoCorrect="off"
            className={`keyring__key ${isError ? 'error' : ' '}`}
            onChange={(event) => onChangeSeed(event)}
            rows={2}
            spellCheck={false}
            value={seedType === 'mnemonic' ? isMnemonic : isSeed}
          />
          <div className="keyring__copy">
            <div className="keyring__copy-wrapper">
              <button
                className="keyring__copy-button"
                type="button"
                onClick={() => copyToClipboard(seedType === 'mnemonic' ? isMnemonic : isSeed, alert, 'Copied')}
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
                  <div className="keyring__actions">
                    <button
                      className="keyring__action-btn"
                      type="button"
                      disabled={!saved}
                      onClick={() => {
                        if (isValid && !isError) {
                          handleCreate(values.password);
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
