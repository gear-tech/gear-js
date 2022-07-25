import styles from './MessagesListHeader.module.scss';

import codeSVG from 'assets/images/code_icon.svg';
import messageIdSVG from 'assets/images/id_icon.svg';
import timestampSVG from 'assets/images/timestamp_icon.svg';

const MessagesListHeader = () => (
  <div className={styles.messagesListHeader}>
    <div className={styles.headerItem}>
      <img className={styles.headerIcon} src={codeSVG} alt="program name" />
      <p>Program name</p>
    </div>
    <div className={styles.headerItem}>
      <img className={styles.headerIcon} src={messageIdSVG} alt="program id" />
      <p>Message Id</p>
    </div>
    <div className={styles.headerItem}>
      <img className={styles.headerIcon} src={timestampSVG} alt="program date" />
      <p>Timestamp</p>
    </div>
  </div>
);

export { MessagesListHeader };
