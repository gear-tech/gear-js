import styles from './PageHeader.module.scss';

import { getShortName } from 'helpers';
import { BackButton } from 'components/BackButton/BackButton';
import ProgramIllustrationSVG from 'assets/images/program_icon.svg';

type Props = {
  title?: string;
  fileName?: string;
};

const PageHeader = ({ title, fileName }: Props) => (
  <div className={styles.pageHeader}>
    <BackButton className={styles.headerBackBtn} />
    <div className={styles.headerInfo}>
      {title && <h2 className={styles.infoTitle}>{title}</h2>}
      {fileName && (
        <div className={styles.infoFile}>
          <img className={styles.fileIcon} src={ProgramIllustrationSVG} alt="code icon" />
          <span className={styles.fileName}>{getShortName(fileName)}</span>
        </div>
      )}
    </div>
  </div>
);

export { PageHeader };
