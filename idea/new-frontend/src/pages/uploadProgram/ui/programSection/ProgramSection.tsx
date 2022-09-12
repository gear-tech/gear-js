import { Metadata } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import { UploadProgram } from 'widgets/uploadProgram';
import { Subheader } from 'shared/ui/subheader';

import styles from '../UploadProgram.module.scss';

type Props = {
  file?: File;
  metadata?: Metadata;
  metadataBuffer?: string;
};

const ProgramSection = ({ file, metadata, metadataBuffer }: Props) => {
  const renderButtons = () => <Button type="submit" text="Upload Program" />;

  return (
    <section className={styles.pageSection}>
      <Subheader size="big" title="Enter program parameters" />
      <UploadProgram
        file={file}
        label="Program file:"
        metadata={metadata}
        metadataBuffer={metadataBuffer}
        onSubmit={() => {}}
        renderButtons={renderButtons}
      />
    </section>
  );
};

export { ProgramSection };
