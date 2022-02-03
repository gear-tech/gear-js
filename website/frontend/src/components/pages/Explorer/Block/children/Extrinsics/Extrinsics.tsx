import React from 'react';
import { Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { Extrinsic } from './Extrinsic/Extrinsic';
import commonStyles from '../../Block.module.scss';
import styles from './Extrinsics.module.scss';

type Props = {
  extrinsics: DotExtrinsic[];
};

const Extrinsics = ({ extrinsics }: Props) => {
  const isAnyEvent = extrinsics.length > 0;

  // replace key
  const getExtrinsics = () => extrinsics.map((extrinsic, index) => <Extrinsic key={index} extrinsic={extrinsic} />);

  return (
    <div className={styles.events}>
      <header className={commonStyles.header}>Extrinsics</header>
      {isAnyEvent ? (
        <ul className={styles.body}>{getExtrinsics()}</ul>
      ) : (
        <p className={commonStyles.message}>No extrinsics available.</p>
      )}
    </div>
  );
};

export { Extrinsics };
