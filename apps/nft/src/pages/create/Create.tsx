import { Button, FileInput, Input, Textarea } from '@gear-js/ui';
import { useIPFS } from 'hooks';
import { useSendMessage } from '@gear-js/react-hooks';
import { ADDRESS } from 'consts';
import { NftMetaWasm } from 'assets';
import { getMintPayload } from 'utils';
import { useForm } from 'react-hook-form';
import styles from './Create.module.scss';

type Values = { name: string; description: string; json?: FileList | undefined; image?: FileList | undefined };
const defaultValues = { name: '', description: '' };

const JSON_FILE_TYPE = 'application/json';
const IMAGE_FILE_TYPE = 'image/png, image/gif, image/jpeg';

function Create() {
  const { register, handleSubmit, formState } = useForm<Values>({ defaultValues });
  const { errors } = formState;

  const ipfs = useIPFS();
  const sendMessage = useSendMessage(ADDRESS.NFT_CONTRACT, NftMetaWasm);

  const onSubmit = (data: Values) => {
    const { name, description } = data;
    const json = data.json![0];
    const image = data.image![0];

    const attachments = [ipfs.add(json), ipfs.add(image)];

    Promise.all(attachments)
      .then(([jsonResult, imgResult]) => getMintPayload(name, description, jsonResult.cid, imgResult.cid))
      .then((payload) => sendMessage(payload));
  };

  return (
    <>
      <h2 className={styles.heading}>Create NFT</h2>
      <div className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.item}>
            <Input label="Name" className={styles.input} {...register('name', { required: 'Name is required' })} />
            <p className={styles.error}>{errors.name?.message}</p>
          </div>

          <div className={styles.item}>
            <Textarea
              label="Description"
              className={styles.input}
              {...register('description', { required: 'Description is required' })}
            />
            <p className={styles.error}>{errors.description?.message}</p>
          </div>

          <div className={styles.item}>
            <FileInput
              label="JSON"
              className={styles.input}
              accept={JSON_FILE_TYPE}
              {...register('json', {
                validate: {
                  required: (files: FileList | undefined) =>
                    !!files?.length || 'Attach JSON with rarity or/and attributes',
                },
              })}
            />
            <p className={styles.error}>{errors.json?.message}</p>
          </div>

          <div className={styles.item}>
            <FileInput
              label="Image"
              className={styles.input}
              accept={IMAGE_FILE_TYPE}
              {...register('image', {
                validate: {
                  required: (files: FileList | undefined) => !!files?.length || 'Attach image',
                  size: (files: FileList | undefined) =>
                    files![0].size / 1024 ** 2 < 10 || 'Image size should not exceed 10MB',
                  extension: (files: FileList | undefined) =>
                    ['image/png', 'image/gif', 'image/jpeg'].includes(files![0].type) ||
                    'Image should be .jpg, .png or .gif',
                },
              })}
            />
            <p className={styles.error}>{errors.image?.message}</p>
          </div>
          <Button type="submit" text="Create" className={styles.button} block />
        </form>
      </div>
    </>
  );
}

export { Create };
