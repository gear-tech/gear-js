import styles from './MessagePageHeader.module.scss';

import { getShortName } from 'helpers';
import { CircleIndicator, IndicatorStatus } from 'components/common/CircleIndicator';
import { BackButton } from 'components/BackButton/BackButton';
import headerStyles from 'components/blocks/PageHeader/PageHeader.module.scss';

type Props = {
  id: string;
  exitCode: number | null;
};
// TODO: think of a universal solution
const MessagePageHeader = ({ id, exitCode }: Props) => (
  <div className={headerStyles.pageHeader}>
    <BackButton className={headerStyles.headerBackBtn} />
    <div className={headerStyles.headerInfo}>
      <h2 className={headerStyles.infoTitle}>Message</h2>
      <div className={headerStyles.infoFile}>
        <CircleIndicator
          status={exitCode ? IndicatorStatus.Error : IndicatorStatus.Success}
          className={styles.messageIndicator}
        />
        <span className={headerStyles.fileName}>{getShortName(id)}</span>
      </div>
    </div>
  </div>
);

export { MessagePageHeader };
