import { useNavigate } from 'react-router-dom';
import { Metadata } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import { UploadProgram } from 'widgets/uploadProgram';
import { Subheader } from 'shared/ui/subheader';
import plusSVG from 'shared/assets/images/actions/plus.svg';
import closeSVG from 'shared/assets/images/actions/close.svg';

import styles from '../UploadProgram.module.scss';

type Props = {
  file?: File;
  metadata?: Metadata;
  metadataBuffer?: string;
};

const ProgramSection = ({ file, metadata, metadataBuffer }: Props) => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  const renderButtons = () => (
    <>
      <Button icon={plusSVG} type="submit" text="Upload Program" />
      <Button icon={closeSVG} text="Cancel Upload" color="light" onClick={goBack} />
    </>
  );

  return (
    <section className={styles.pageSection}>
      <Subheader size="big" title="Enter program parameters" />
      <UploadProgram
        file={file}
        label="Program file"
        metadata={metadata}
        metadataBuffer={metadataBuffer}
        onSubmit={() => {}}
        renderButtons={renderButtons}
      />
    </section>
  );
};

export { ProgramSection };
