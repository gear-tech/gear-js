import { useState } from 'react';
import clsx from 'clsx';
import { Button } from '@gear-js/ui';

import styles from './BlocksList.module.scss';

import { useBlocks } from 'hooks';

const BlockList = () => {
  const blocks = useBlocks();

  const [isShortView, setIsShortView] = useState(true);

  const handleClick = () => setIsShortView(false);

  return (
    <div className={styles.blockList}>
      <h3 className={styles.blockListHeader}>Recent blocks: {blocks.length && blocks[0].number}</h3>
      {blocks.length > 0 ? (
        <>
          <ul className={clsx(isShortView && styles.shortList)}>
            {blocks.map((block) => (
              <li key={block.number} className={styles.programsListItem}>
                <span className={styles.programsListNumber}>{block.number}</span>
                <span className={styles.programsListName}>{block.hash}</span>
                <span className={styles.programsListTime}>{block.time}</span>
              </li>
            ))}
          </ul>
          {isShortView && (
            <Button
              size="small"
              text="Show more"
              color="secondary"
              className={styles.blockListButton}
              onClick={handleClick}
            />
          )}
        </>
      ) : (
        <div className={styles.noMessage}>There are no blocks</div>
      )}
    </div>
  );
};

export { BlockList };
