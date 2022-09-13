import { UploadProgram, UploadProgramProps } from 'widgets/uploadProgram';
import { Subheader } from 'shared/ui/subheader';

import styles from '../UploadProgram.module.scss';

const ProgramSection = ({ file, metadata, metadataBuffer }: UploadProgramProps) => (
  <section className={styles.pageSection}>
    <Subheader size="big" title="Enter program parameters" />
    <UploadProgram file={file} metadata={metadata} metadataBuffer={metadataBuffer} />
  </section>
);

export { ProgramSection };
