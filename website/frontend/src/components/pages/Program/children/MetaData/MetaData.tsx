import react, { FC } from 'react';
import { Metadata } from '@gear-js/api';
import { getProgramTypes } from 'helpers';
import styles from './MetaData.module.scss';

type Props = {
  metadata: Metadata | null;
};

export const MetaData: FC<Props> = ({ metadata }) => {
  const getItems = () => {
    let items = [];

    if (metadata) {
      let key: keyof typeof metadata;

      for (key in metadata) {
        if (metadata[key]) {
          const isTypes = key === 'types';

          items.push({
            label: key,
            value: isTypes ? getProgramTypes(metadata.types!) : metadata[key],
          });
        }
      }
    }

    return items.reverse();
  };

  return (
    <div className={styles.list}>
      {getItems().map((item) => {
        return (
          <div className={styles.item}>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.value}>{item.value}</span>
          </div>
        );
      })}
    </div>
  );
};
