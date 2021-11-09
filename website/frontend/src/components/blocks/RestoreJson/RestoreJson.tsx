import React, { useState, useRef } from 'react';
import { useAlert } from 'react-alert';
import { RPC_METHODS } from 'consts';
import { readFileAsync, toShortAddress } from 'helpers';
import { GearKeyring } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import { Formik, Field, Form } from 'formik';
import cancel from 'assets/images/cancel.svg';
import Refresh from 'assets/images/refresh.svg';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { Schema } from './Schema';
import './RestoreJson.scss';

type Props = {
  handleClose: () => void;
};

export const RestoreJson = ({ handleClose }: Props) => {
  const [droppedFile, setDroppedFile] = useState<any>(null);
  const [isLoaded, setLoaded] = useState(false);
  const [json, setJson] = useState<any>(null);

  const apiRequest = new ServerRPCRequestService();
  const alert = useAlert();
  const hiddenFileInput = useRef<any>(null);

  const fileUploadAction = () => {
    hiddenFileInput.current.click();
  };

  const removeJsonFile = () => {
    setDroppedFile(null);
    setLoaded(false);
    setJson(null);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (files?.length) {
      setDroppedFile(files[0]);
      setLoaded(true);
      try {
        const fileBuffer: any = await readFileAsync(files[0]);
        const jsonRaw = JSON.parse(new TextDecoder().decode(fileBuffer));
        setJson(jsonRaw);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRestore = async (password: string) => {
    try {
      const keyring = await GearKeyring.fromJson(json, password);
      const keyPairJson = await GearKeyring.toJson(keyring);
      const isAddressRaw = u8aToHex(keyring.addressRaw);

      localStorage.setItem('gear_mnemonic', JSON.stringify(keyPairJson));
      localStorage.setItem('public_key', keyring.address);

      apiRequest.getResource(RPC_METHODS.ADD_PUBLIC, {
        publickKeyRaw: isAddressRaw,
        publickKey: keyring.address,
      });
      localStorage.setItem('public_key_raw', isAddressRaw);
      handleClose();
    } catch (error) {
      alert.error(`${error}`);
    }
  };

  return (
    <div className="restore__wrapper">
      {(json && <p className="restore__info">{toShortAddress(json.address)}</p>) || (
        <p className="restore__info">5xxxxxxx...xxxxxxx</p>
      )}
      <div className="restore__drop-area">
        <input
          id="restore"
          type="file"
          accept="application/json"
          ref={hiddenFileInput}
          onChange={handleUpload}
          hidden
        />
        {(droppedFile && (
          <div className="restore__filemeta">
            <span>{`${droppedFile.name} (${droppedFile.size})`}</span>
            <button type="button" onClick={removeJsonFile}>
              <img alt="cancel" src={cancel} />
            </button>
          </div>
        )) || (
          <button className="restore__load-btn" type="button" onClick={fileUploadAction}>
            Restore from JSON
          </button>
        )}

        <div className="restore__info">
          Supply a backed-up JSON file, encrypted with your account-specific password.
        </div>
      </div>
      <div className="restore__password">
        <Formik
          initialValues={{
            password: '',
          }}
          validationSchema={Schema}
          onSubmit={() => {}}
        >
          {({ values, errors, isValid = false, touched }) => (
            <Form id="password-form">
              <div className="restore__password--wrapper">
                <div className="restore__password-form--col">
                  <div className="restore__password-form--info">
                    <div className="restore__password-form--field">
                      <Field type="password" name="password" id="password" placeholder="Password" />
                      {errors.password && touched.password ? (
                        <div className="restore__password-form--error">{errors.password}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="restore__actions">
                  <button
                    className="restore__action-btn"
                    type="button"
                    disabled={!isLoaded}
                    onClick={() => {
                      if (isValid) {
                        handleRestore(values.password);
                      }
                    }}
                  >
                    <img src={Refresh} alt="refresh" />
                    Restore
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
