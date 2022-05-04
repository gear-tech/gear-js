import { Button, Input, Textarea } from '@gear-js/ui';
import { FormEvent, useRef } from 'react';
import nftMetaWasm from 'assets/wasm/nft.meta.wasm';
import { useApi, useIPFS, useForm, useMetadata, useAccount, useLoading, useStatus } from 'hooks';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { CID } from 'ipfs-http-client';
import { sendMessage } from 'utils';
import styles from './Create.module.scss';

type Values = { name: string; description: string; attrs?: File | undefined; image?: File | undefined };

function Create() {
  const { api } = useApi();
  const { account } = useAccount();
  const ipfs = useIPFS();
  const { enableLoading } = useLoading();
  const { metadata } = useMetadata(nftMetaWasm);
  const handleStatus = useStatus();

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
      const [{ cid: attrsCid }, { cid: imgCid }] = await Promise.all(attachments);

      const payload = getMintPayload(attrsCid, imgCid);
      sendMessage(api, account, NFT_CONTRACT_ADDRESS, payload, metadata, handleStatus);
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
