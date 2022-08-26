import { useEffect, useRef } from 'react';

import { ChainBlock } from 'entities/chainBlock';

import styles from './Graph.module.scss';
import { getRandomPercent } from '../../helpers';

type Props = {
  blocks: ChainBlock[];
};

const Graph = ({ blocks }: Props) => {
  const percents = useRef<number[]>(blocks.map(getRandomPercent));

  const addPercent = () => {
    const slicedArray = percents.current.length > 12 ? percents.current.slice(1) : percents.current;

    percents.current = [...slicedArray, getRandomPercent()];
  };

  useEffect(() => {
    if (!blocks.length) {
      return;
    }

    addPercent();
  }, [blocks]);

  return (
    <div className={styles.graph}>
      {percents.current.map((value, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <hr key={index} style={{ height: `${value}%` }} className={styles.line} />
      ))}
    </div>
  );
};

export { Graph };
