import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import { useBlocks, useOutsideClick } from 'hooks';
import { IChainBlock } from 'entities/chainBlock';
import { AnimationTimeout } from 'shared/config';
import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';

import styles from './RecentBlocks.module.scss';
import { Graph } from './graph';
import { RecentBlocksList } from './recentBlocksList';

const RecentBlocks = () => {
  const blocks = useBlocks();

  const [block, setBlock] = useState<IChainBlock>();
  const [isOpen, setIsOpen] = useState(false);
  const [timeInstance, setTimeInstance] = useState(0);

  const toggleList = () => setIsOpen((prevState) => !prevState);

  const sectionRef = useOutsideClick<HTMLSelectElement>(toggleList, isOpen);

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

  const buttonClasses = clsx(buttonStyles.button, buttonStyles.transparent, buttonStyles.noText, styles.blocksBtn);

  return (
    <CSSTransition in={isOpen} timeout={AnimationTimeout.Default}>
      <section ref={sectionRef} className={styles.recentBlocks}>
        <div className={styles.content}>
          <Graph blocks={blocks} className={styles.graph} />
          <div className={styles.blockInfo}>
            <h2 className={styles.title}>Recent block</h2>
            <p className={styles.indicators}>
              <span className={styles.value}>{blockNumber}</span>
              <span className={styles.point} />
              <span className={styles.time}>{time}</span>
            </p>
          </div>
          <button type="button" className={buttonClasses} onClick={toggleList}>
            <ArrowSVG />
          </button>
        </div>
        <CSSTransition in={isOpen} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
          <RecentBlocksList blocks={blocks} className={styles.recentBlocksList} />
        </CSSTransition>
      </section>
    </CSSTransition>
  );
};

export { RecentBlocks };
