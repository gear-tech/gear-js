import { Button, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@polkadot/util/types';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAddIdl } from '@/features/sails';
import { useAddCodeName, useAddMetadata, useAddProgramName, useContractApiWithFile } from '@/hooks';
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
  [FIELD_NAME.NAME]: z.string().trim(),
});

type Props = ModalProps & {
  codeId: HexString;
  metadataHash: HexString | null | undefined;
  isNameEditable: boolean;
  programId?: HexString;
  onSuccess: (name: string, metadataHex?: HexString) => void;
};

const UploadMetadataModal = ({ codeId, programId, isNameEditable, metadataHash, onClose, onSuccess }: Props) => {
  const addMetadata = useAddMetadata();
  const addIdl = useAddIdl();
  const addProgramName = useAddProgramName();
  const addCodeName = useAddCodeName();

  // useContractApiWithFile is based on meta-storage requests, we don't need them here
  const { metadata, sails, ...contractApi } = useContractApiWithFile(undefined);

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(SCHEMA),
  });

  const handleSubmit = form.handleSubmit(async ({ name }) => {
    if (name) {
      if (programId) {
        await addProgramName({ id: programId, codeId, name, idl: sails.idl });
      } else {
        await addCodeName({ id: codeId, name, idl: sails.idl });
      }
    }

    if (metadataHash && metadata.hex) {
      await addMetadata(metadataHash, metadata.hex);

      onSuccess(name, metadata.hex);
      return onClose();
    }

    if (sails.idl) {
      await addIdl(codeId, sails.idl);

      onSuccess(name);
      return onClose();
    }

    throw new Error('Metadata/sails file is required');
  });

  return (
    <Modal heading="Upload metadata/sails" size="large" className={styles.modal} close={onClose}>
      <FormProvider {...form}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {isNameEditable && (
            <Input name={FIELD_NAME.NAME} label={programId ? 'Program Name' : 'Code Name'} direction="y" block />
          )}

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
