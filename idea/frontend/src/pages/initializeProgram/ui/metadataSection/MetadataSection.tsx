import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

import { UploadMetadata } from 'features/uploadMetadata';
import { Subheader } from 'shared/ui/subheader';

import styles from '../InitializeProgram.module.scss';

type Props = {
  metadata: ProgramMetadata | undefined;
  onReset: () => void;
  onUpload: (metaHex: HexString) => void;
};

const MetadataSection = ({ metadata, onReset, onUpload }: Props) => (
  <section className={styles.pageSection}>
    <Subheader size="big" title="Add metadata" />
    <UploadMetadata metadata={metadata} onReset={onReset} onUpload={onUpload} />
  </section>
);

export { MetadataSection };
