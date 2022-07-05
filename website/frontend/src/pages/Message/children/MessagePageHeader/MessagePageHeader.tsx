import clsx from 'clsx';

import styles from './MessagePageHeader.module.scss';

import { fileNameHandler } from 'helpers';
import { BackButton } from 'components/BackButton/BackButton';
import headerStyles from 'components/blocks/PageHeader/PageHeader.module.scss';

type Props = {
  id: string;
  isError: boolean;
};
// TODO: think of a universal solution
const MessagePageHeader = ({ id, isError }: Props) => (
  <div className={headerStyles.pageHeader}>
    <BackButton className={headerStyles.headerBackBtn} />
    <div className={headerStyles.headerInfo}>
      <h2 className={headerStyles.infoTitle}>Message</h2>
      <div className={headerStyles.infoFile}>
        <span className={clsx(styles.messageIndicator, isError && styles.failure)} />
        <span className={headerStyles.fileName}>{fileNameHandler(id)}</span>
      </div>
    </div>
  </div>
);

export { MessagePageHeader };
