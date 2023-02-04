import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

import { UploadMetadata } from 'features/uploadMetadata';
import { Subheader } from 'shared/ui/subheader';

import commonStyles from '../UploadProgram.module.scss';

type Props = {
  metadata?: ProgramMetadata;
  onReset: () => void;
  onUpload: (metaHex: HexString) => void;
};

const MetadataSection = ({ metadata, onReset, onUpload }: Props) => (
  <section className={commonStyles.pageSection}>
    <Subheader size="big" title="Add metadata" />
    <UploadMetadata metadata={metadata} onReset={onReset} onUpload={onUpload} />
  </section>
);

export { MetadataSection };
