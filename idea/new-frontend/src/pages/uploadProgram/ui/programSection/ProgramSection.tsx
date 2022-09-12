import { Metadata } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import { ProgramForm } from 'widgets/programForm';
import { Subheader } from 'shared/ui/subheader';

import styles from '../UploadProgram.module.scss';

type Props = {
  metadata?: Metadata;
  metadataBuffer?: string;
};

const ProgramSection = ({ metadata, metadataBuffer }: Props) => {
  const renderButtons = () => <Button type="submit" text="Upload Program" />;

  return (
    <section className={styles.pageSection}>
      <Subheader size="big" title="Enter program parameters" />
      <ProgramForm
        name="FILE NAME"
        label="Program name"
        metadata={metadata}
        metadataBuffer={metadataBuffer}
        onSubmit={() => {}}
        renderButtons={renderButtons}
      />
    </section>
  );
};

export { ProgramSection };
