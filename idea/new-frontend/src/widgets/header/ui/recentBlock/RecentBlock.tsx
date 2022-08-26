import { useState, useEffect } from 'react';

import { useBlocks } from 'hooks';
import { ChainBlock } from 'entities/chainBlock';

import styles from './RecentBlock.module.scss';
import headerStyles from '../Header.module.scss';
import { Graph } from '../graph';

const RecentBlock = () => {
  const blocks = useBlocks();

  const [block, setBlock] = useState<ChainBlock>();
  const [timeInstance, setTimeInstance] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeInstance((prevState) => prevState + 0.1);
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!blocks.length) {
      return;
    }

    const lastBlock = blocks[0];

    if (lastBlock.hash !== block?.hash) {
      setTimeInstance(0);
    }

    setBlock(lastBlock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  const time = `${timeInstance.toFixed(1)} s`;
  const blockNumber = `#${block?.number ?? '00000'}`;

  return (
    <section className={styles.recentBlock}>
      <Graph blocks={blocks} />
      <div className={styles.blockInfo}>
        <h2 className={headerStyles.title}>Recent block</h2>
        <p className={headerStyles.content}>
          <span className={headerStyles.value}>{blockNumber}</span>
          <span className={styles.point} />
          <span>{time}</span>
        </p>
      </div>
    </section>
  );
};

export { RecentBlock };
