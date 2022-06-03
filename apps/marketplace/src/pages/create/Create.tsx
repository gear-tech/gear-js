import { Button, Input, Textarea, FileInput } from '@gear-js/ui';
import { FormEvent, useState, useMemo } from 'react';
import { useIPFS, useForm, useNftMessage } from 'hooks';
import { CID } from 'ipfs-http-client';
import styles from './Create.module.scss';

type Values = { name: string; description: string; json?: File | undefined; image?: File | undefined };
const initValues = { name: '', description: '' };

function Create() {
  const ipfs = useIPFS();
  const sendMessage = useNftMessage();

  const { values, handleChange, handleFileChange } = useForm<Values>(initValues);
  const { name, description, json, image } = values;

  const trimmedName = useMemo(() => name.trim(), [name]);
  const trimmedDescription = useMemo(() => description.trim(), [description]);

  const [error, setError] = useState('');

  const getMintPayload = (jsonCid: CID, imgCid: CID) => {
    const tokenMetadata = {
      name: trimmedName,
      description: trimmedDescription,
      media: imgCid.toString(),
      reference: jsonCid.toString(),
    };

    return { Mint: { tokenMetadata } };
  };

  const resetError = () => {
    setError('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (trimmedName && trimmedDescription) {
      if (image && json) {
        const imageTypes = ['image/png', 'image/gif', 'image/jpeg'];
        const isImage = imageTypes.includes(image.type);
        const isImageSizeValid = image.size / 1024 ** 2 < 10;
        const isJson = json.type === 'application/json';

        if (isImage && isImageSizeValid) {
          if (isJson) {
            const attachments = [ipfs.add(json), ipfs.add(image)];

            Promise.all(attachments)
              .then(([jsonResult, imgResult]) => getMintPayload(jsonResult.cid, imgResult.cid))
              .then((payload) => sendMessage(payload));
          } else {
            setError('Please provide valid .json');
          }
        } else {
          setError("Image should be .jpg, .png or .gif and it's size should not exceed 10MB");
        }
      } else {
        setError('Please attach files');
      }
    } else {
      setError('Name and description are required');
    }
  };

  return (
    <>
      <h2 className={styles.heading}>Create NFT</h2>
      <div className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit} onChange={resetError}>
          <Input className={styles.input} label="Name" name="name" value={name} onChange={handleChange} />
          <Textarea
            className={styles.input}
            label="Description"
            name="description"
            value={description}
            onChange={handleChange}
          />
          <FileInput
            label="JSON"
            className={styles.input}
            name="json"
            value={json}
            onChange={handleFileChange}
            accept="application/json"
          />
          <FileInput
            label="Image"
            className={styles.input}
            name="image"
            value={image}
            onChange={handleFileChange}
            accept="image/png, image/gif, image/jpeg"
          />
          <Button type="submit" text="Create" disabled={!!error} block />
          <p className={styles.error}>{error}</p>
        </form>
      </div>
    </>
  );
}

export default Create;
