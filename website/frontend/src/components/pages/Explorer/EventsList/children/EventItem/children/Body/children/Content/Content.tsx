import React from 'react';
import { GenericEventData } from '@polkadot/types';
import clsx from 'clsx';
import eventStyles from '../../../../EventItem.module.scss';
import bodyStyles from '../../Body.module.scss';

const commonStyles = { ...bodyStyles, ...eventStyles };

type Props = {
  data: GenericEventData;
};

const Content = ({ data }: Props) => {
  const preClassName = clsx(commonStyles.text, commonStyles.pre);
  const formattedData = JSON.stringify(data, null, 2);

  return <pre className={preClassName}>{formattedData}</pre>;
};

export { Content };
