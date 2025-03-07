import { useApi } from '@gear-js/react-hooks';
import { U128 } from '@polkadot/types';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { useBlocks, useOutsideClick } from '@/hooks';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import { AnimationTimeout } from '@/shared/config';

import { getMinWidth } from '../helpers';
import { RecentBlock } from '../types';

import styles from './RecentBlocks.module.scss';
import { Graph } from './graph';
import { RecentBlocksList } from './recentBlocksList';

const RecentBlocks = () => {
  const { api, isApiReady } = useApi();
  const blocks = useBlocks();

  const [block, setBlock] = useState<RecentBlock>();
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
    if (!isApiReady) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO(#1800): resolve eslint comments
    api.query.gear.blockNumber((result: U128) => setGearBlock(result.toNumber()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

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
      {/* TODO(#1780): remove nodeRef prop */}
      <CSSTransition nodeRef={sectionRef} in={isOpen} timeout={AnimationTimeout.Default}>
        <section ref={sectionRef} className={blocksClasses}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
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

          <RecentBlocksList blocks={blocks} className={styles.recentBlocksList} />
        </section>
      </CSSTransition>
    </div>
  );
};

export { RecentBlocks };
