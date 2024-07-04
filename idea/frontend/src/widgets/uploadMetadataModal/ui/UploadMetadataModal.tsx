import { useAlert, useApi } from '@gear-js/react-hooks';
import { Button, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@polkadot/util/types';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { addCodeName, addMetadata, addProgramName } from '@/api';
import { addIdl } from '@/features/sails';
import { useChain, useContractApiWithFile } from '@/hooks';
import { ModalProps } from '@/entities/modal';
import { UploadMetadata } from '@/features/uploadMetadata';
import { Input } from '@/shared/ui';

import styles from './UploadMetadataModal.module.scss';

const FIELD_NAME = {
  NAME: 'name',
} as const;

const DEFAULT_VALUES = {
  [FIELD_NAME.NAME]: '',
};

const SCHEMA = z.object({
  [FIELD_NAME.NAME]: z.string().trim().min(1),
});

type Props = ModalProps & {
  codeId: HexString;
  programId?: HexString;
  onSuccess: (name: string, metadataHex?: HexString) => void;
};

const UploadMetadataModal = ({ codeId, programId, onClose, onSuccess }: Props) => {
  const { api, isApiReady } = useApi();
  const { isDevChain } = useChain();
  const alert = useAlert();

  // useContractApiWithFile is based on meta-storage requests, we don't need them here
  const { metadata, sails, ...contractApi } = useContractApiWithFile(undefined);

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(SCHEMA),
  });

  const handleSubmit = form.handleSubmit(async ({ name }) => {
    if (!isApiReady) throw new Error('API is not initialized');

    try {
      if (programId) {
        if (!isDevChain) await addProgramName({ name, id: programId });
      } else {
        await addCodeName({ name, id: codeId });
      }

      if (metadata.hex) {
        const metahash = await api.code.metaHash(codeId);
        await addMetadata(metahash, metadata.hex);

        onSuccess(name, metadata.hex);
        onClose();
      }

      if (sails.idl) {
        await addIdl(codeId, sails.idl);

        onSuccess(name);
        onClose();
      }

      throw new Error('Metadata/sails file is required');
    } catch (error) {
      alert.error(error instanceof Error ? error.message : String(error));
    }
  });

  return (
    <Modal heading="Upload metadata/sails" size="large" className={styles.modal} close={onClose}>
      <FormProvider {...form}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input name={FIELD_NAME.NAME} label={programId ? 'Program Name' : 'Code Name'} direction="y" block />

          <UploadMetadata
            value={contractApi.file}
            onChange={contractApi.handleChange}
            metadata={metadata.value}
            idl={sails.idl}
          />

          <Button type="submit" text="Submit" block />
        </form>
      </FormProvider>
    </Modal>
  );
};

export { UploadMetadataModal };
