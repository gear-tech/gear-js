import { Button, Input, Textarea } from '@gear-js/ui';
import { FormEvent, useRef, useState } from 'react';
import { useForm } from 'hooks';
import { useIPFS } from 'hooks/context';
import styles from './Create.module.scss';

type Values = { name: string; description: string; attrs?: File | undefined; image?: File | undefined };

function Create() {
  const ipfs = useIPFS();

  const { values, handleChange, handleFileChange } = useForm<Values>({ name: '', description: '' });
  const { name, description, attrs } = values;

  const [cid, setCid] = useState('');

  const attrsInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleUploadAttrsClick = () => {
    attrsInputRef.current?.click();
  };

  const handleUploadImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (attrs) {
      ipfs.add(attrs).then((result) => setCid(result.cid.toString()));
    }
  };

  console.log(cid);

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
