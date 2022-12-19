import { ProgramMetadata } from '@gear-js/api';

import { UploadMetadata, UploadData } from 'features/uploadMetadata';
import { Subheader } from 'shared/ui/subheader';

import styles from '../UploadProgram.module.scss';

type Props = {
  metadata?: ProgramMetadata;
  onReset: () => void;
  onUpload: (data: UploadData) => void;
};

const MetadataSection = ({ metadata, onReset, onUpload }: Props) => (
  <section className={styles.pageSection}>
    <Subheader size="big" title="Add metadata" />
    <UploadMetadata metadata={metadata} onReset={onReset} onUpload={onUpload} />
  </section>
);

export { MetadataSection };
