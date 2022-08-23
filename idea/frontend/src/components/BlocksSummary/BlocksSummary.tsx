import { useEffect, useState, useRef } from 'react';
import { useApi } from '@gear-js/react-hooks';

import styles from './BlocksSummary.module.scss';

import { useBlocks } from 'hooks';
import { Tooltip } from 'components/common/Tooltip';
import { ReactComponent as QuestionSVG } from 'assets/images/circleQuestion.svg';

const BlocksSummary = () => {
  const { api } = useApi();
  const blocks = useBlocks();

  const prevBlockHash = useRef('');

  const [timeInstance, setTimeInstance] = useState(0);
  const [totalIssuance, setTotalIssuance] = useState('');

  useEffect(() => {
    api.totalIssuance().then((result) => setTotalIssuance(result.slice(0, 5)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeInstance((prevState) => prevState + 0.1);
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!blocks || !blocks.length) {
      return;
    }

    const lastBlockHash = blocks[0].hash;

    if (lastBlockHash !== prevBlockHash.current) {
      setTimeInstance(0);
    }

    prevBlockHash.current = lastBlockHash;
  }, [blocks]);

  return (
    <div className={styles.summary}>
      <div className={styles.section}>
        <p>Last block</p>
        <p className={styles.data}>
          <span className={styles.number}>{timeInstance.toFixed(1)}</span> s
        </p>
      </div>
      <div className={styles.section}>
        <p>Total issuance</p>
        <div className={styles.data}>
          <span className={styles.number}>{totalIssuance}</span>
          <span>MUnit</span>
          <Tooltip
            content="Total issuance balance MUnits"
            className={styles.question}
            contentClassName={styles.questionTooltip}
          >
            <QuestionSVG />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export { BlocksSummary };
