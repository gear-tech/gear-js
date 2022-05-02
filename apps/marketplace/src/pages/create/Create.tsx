import { Button, Input, Textarea } from '@gear-js/ui';
import { FormEvent, useRef } from 'react';
import { useAlert } from 'react-alert';
import nftMetaWasm from 'assets/wasm/nft.meta.wasm';
import { useApi, useIPFS, useForm, useMetadata, useAccount, useLoading } from 'hooks';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { web3FromSource } from '@polkadot/extension-dapp';
import { GearKeyring } from '@gear-js/api';
import { ISubmittableResult } from '@polkadot/types/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { CID } from 'ipfs-http-client';
import styles from './Create.module.scss';

type Values = { name: string; description: string; attrs?: File | undefined; image?: File | undefined };

function Create() {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const ipfs = useIPFS();
  const { enableLoading, disableLoading } = useLoading();
  const { metadata } = useMetadata(nftMetaWasm);

  const { values, handleChange, handleFileChange } = useForm<Values>({ name: '', description: '' });
  const { name, description, attrs, image } = values;

  const attrsInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleUploadAttrsClick = () => {
    attrsInputRef.current?.click();
  };

  const handleUploadImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleEventsStatus = (events: EventRecord[]) => {
    events.forEach(({ event: { method } }) => {
      if (method === 'DispatchMessageEnqueued') {
        alert.success('Send message: Finalized');
        // resetValues();
      } else if (method === 'ExtrinsicFailed') {
        alert.info('Extrinsic failed');
      }
    });
  };

  const handleStatus = (result: ISubmittableResult) => {
    const { status, events } = result;
    const { isInBlock, isInvalid, isFinalized } = status;

    if (isInvalid) {
      alert.info('Transaction error. Status: isInvalid');
      disableLoading();
    } else if (isInBlock) {
      alert.success('Send message: In block');
    } else if (isFinalized) {
      handleEventsStatus(events);
      disableLoading();
    }
  };

  const getMintPayload = (attrsCid: CID, imgCid: CID) => {
    const ipfsPath = 'https://ipfs.io/ipfs/';
    const reference = ipfsPath + attrsCid.toString();
    const media = ipfsPath + imgCid.toString();

    const nft = { name, description, media, reference };
    return { Mint: { tokenMetadata: nft } };
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (account && metadata && attrs && image) {
      enableLoading();

      const attachments = [ipfs.add(attrs), ipfs.add(image)];

      Promise.all(attachments).then(([{ cid: attrsCid }, { cid: imgCid }]) => {
        const { address } = account;
        const decodedAddress = GearKeyring.decodeAddress(address);

        const destination = NFT_CONTRACT_ADDRESS;
        const payload = getMintPayload(attrsCid, imgCid);

        api.program.gasSpent.handle(decodedAddress, destination, payload, 0, metadata).then((gasLimit) => {
          const message = { destination, payload, gasLimit };
          api.message.submit(message, metadata);

          web3FromSource(account.meta.source)
            .then(({ signer }) => ({ signer }))
            .then((options) => api.message.signAndSend(account.address, options, handleStatus));
        });
      });
    }
  };

  return (
    <>
      <h2 className={styles.heading}>Create NFT</h2>
      <div className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input className={styles.input} label="Name" name="name" value={name} onChange={handleChange} />
          <Textarea
            className={styles.input}
            label="Description"
            name="description"
            value={description}
            onChange={handleChange}
          />
          <input className={styles.file} type="file" name="attrs" onChange={handleFileChange} ref={attrsInputRef} />
          <input className={styles.file} type="file" name="image" onChange={handleFileChange} ref={imageInputRef} />
          <div className={styles.buttons}>
            <Button text="Upload attributes" color="secondary" onClick={handleUploadAttrsClick} />
            <Button text="Upload image" color="secondary" onClick={handleUploadImageClick} />
            <Button type="submit" text="Create" />
          </div>
        </form>
      </div>
    </>
  );
}

export default Create;
