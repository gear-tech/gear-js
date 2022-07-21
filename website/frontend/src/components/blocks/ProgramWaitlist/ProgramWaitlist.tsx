import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { WaitlistItem } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import styles from './ProgramWaitlist.module.scss';
import { getRowKey } from './helpers';
import { TABLE_HEADER, TABLE_COLS } from './const';
import { WaitlistRowItem } from './children/WaitlistRowItem';

import { HumanWaitlistItem } from 'types/api';
import { Table } from 'components/common/Table';
import triangleSVG from 'assets/images/triangle.svg';

type Props = {
  waitlist: WaitlistItem[];
};

const ProgramWaitlist = ({ waitlist }: Props) => {
  const [isOpen, setIsOpen] = useState(Boolean(waitlist.length));

  const handleClick = () => setIsOpen((prevState) => !prevState);

  const renderRow = useCallback((row: WaitlistItem) => {
    const [content, interval] = row.toHuman() as HumanWaitlistItem;

    return <WaitlistRowItem content={content} interval={interval} />;
  }, []);

  return (
    <div className={styles.waitlistWrapper}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.header}>Waitlist messages</h3>
        <Button
          icon={triangleSVG}
          color="transparent"
          className={clsx(styles.button, isOpen && styles.openBtn)}
          onClick={handleClick}
        />
        <span className={styles.count}>{waitlist.length}</span>
      </div>
      {isOpen && (
        <Table
          rows={waitlist}
          cols={TABLE_COLS}
          header={TABLE_HEADER}
          getRowKey={getRowKey}
          className={styles.waitlistTable}
          bodyClassName={styles.waitlistTableBody}
          defaultMessage="No entries on the waitlist"
          renderRow={renderRow}
        />
      )}
    </div>
  );
};

export { ProgramWaitlist };
