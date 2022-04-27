import styles from './PageHeader.module.scss';

import { fileNameHandler } from 'helpers';
import { BackButton } from 'components/BackButton/BackButton';
import ProgramIllustrationSVG from 'assets/images/program_icon.svg';

type Props = {
  title: string;
  fileName: string;
};

export const PageHeader = ({ title, fileName }: Props) => (
  <div className={styles.pageHeader}>
    <BackButton className={styles.headerBackBtn} />
    <div className={styles.headerInfo}>
      <h2 className={styles.infoTitle}>{title}</h2>
      <div className={styles.infoFile}>
        <img className={styles.fileIcon} src={ProgramIllustrationSVG} alt="file" />
        <span className={styles.fileName}>{fileNameHandler(fileName)}</span>
      </div>
    </div>
  </div>
);
