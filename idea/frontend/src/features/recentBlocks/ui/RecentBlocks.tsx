/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';

import { useBlocks, useOutsideClick } from 'hooks';
import { IChainBlock } from 'entities/chainBlock';
import { AnimationTimeout } from 'shared/config';
import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';

import { useApi } from '@gear-js/react-hooks';
import { U128 } from '@polkadot/types';
import styles from './RecentBlocks.module.scss';
import { getMinWidth } from '../helpers';
import { Graph } from './graph';
import { RecentBlocksList } from './recentBlocksList';

const RecentBlocks = () => {
  const { api } = useApi();
  const blocks = useBlocks();

  const [block, setBlock] = useState<IChainBlock>();
  const [gearBlock, setGearBlock] = useState<number>();

  const [isOpen, setIsOpen] = useState(false);
  const [timeInstance, setTimeInstance] = useState(0);

  const toggleList = () => setIsOpen((prevValue) => !prevValue);
  const closeList = () => setIsOpen(false);

  const sectionRef = useOutsideClick<HTMLSelectElement>(closeList, isOpen);

  const location = useLocation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeInstance((prevState) => prevState + 0.1);
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!blocks.length) return;

    const lastBlock = blocks[0];

    if (lastBlock.hash !== block?.hash) {
      setTimeInstance(0);
    }

    setBlock(lastBlock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  useEffect(() => {
    api.query.gear.blockNumber((result: U128) => setGearBlock(result.toNumber()));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    closeList();
  }, [location]);

  const time = `${timeInstance.toFixed(1)} s`;
  const blockNumber = `#${block?.number ?? '00000'}`;
  const gearBlockNumber = `#${gearBlock ?? '00000'}`;

  const arrowClassName = clsx(styles.arrow, isOpen && styles.rotated);

  const blocksClasses = clsx(styles.recentBlocks, isOpen && styles.open);

  return (
    <div className={styles.recentBlocksWrapper}>
      <CSSTransition in={isOpen} timeout={AnimationTimeout.Default}>
        <section ref={sectionRef} className={blocksClasses}>
          <div className={styles.content} onClick={toggleList}>
            <Graph blocks={blocks} className={styles.graph} />

            <div className={styles.blockInfo}>
              <h2 className={styles.title}>Recent block</h2>
              <p className={styles.indicators}>
                <span style={getMinWidth(blockNumber)} className={styles.value}>
                  {blockNumber}
                </span>

                <span className={styles.point} />
                <span className={styles.time}>{time}</span>
              </p>
            </div>

            <div className={styles.blockInfo}>
              <h2 className={styles.title}>Gear block</h2>
              <p className={styles.indicators}>
                <span style={getMinWidth(gearBlockNumber)} className={styles.value}>
                  {gearBlockNumber}
                </span>
              </p>
            </div>

            <ArrowSVG className={arrowClassName} />
          </div>
          <CSSTransition in={isOpen} timeout={AnimationTimeout.Default}>
            <RecentBlocksList blocks={blocks} className={styles.recentBlocksList} />
          </CSSTransition>
        </section>
      </CSSTransition>
    </div>
  );
};

export { RecentBlocks };
