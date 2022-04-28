import { Button, Input, Textarea } from '@gear-js/ui';
import { FormEvent, useRef } from 'react';
import { useForm } from 'hooks';
import styles from './Create.module.scss';

function Create() {
  const { values, handleChange } = useForm({ name: '', description: '', attributes: '', file: '' });
  const { name, description, attributes, file } = values;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitValues = { ...values, attributes: `{ "attributes": { ${attributes} } }` };

    console.log(submitValues);
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
          <Textarea
            className={styles.input}
            label="Attributes"
            name="attributes"
            value={attributes}
            onChange={handleChange}
          />
          <input
            className={styles.file}
            type="file"
            name="file"
            value={file}
            onChange={handleChange}
            ref={fileInputRef}
          />
          <div className={styles.buttons}>
            <Button text="Upload image" color="secondary" onClick={handleUploadClick} />
            <Button type="submit" text="Create" />
          </div>
        </form>
      </div>
    </>
  );
}

export default Create;
