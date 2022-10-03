import clsx from 'clsx';
import { DispatchInfo, Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { IdeaEvent, Method, Section } from 'entities/explorer';

import { Extrinsic } from '../extrinsic';
import { BlockEvent } from '../blockEvent';
import commonStyles from '../Explorer.module.scss';
import styles from './Row.module.scss';

type Props = {
  extrinsic: DotExtrinsic;
  events: IdeaEvent[] | undefined;
};

const Row = ({ extrinsic, events }: Props) => {
  // eslint-disable-next-line react/no-array-index-key
  const getEvents = () => events?.map((event, index) => <BlockEvent key={index} value={event} />);

  const getInfoEvent = () =>
    events?.find(({ section, method }) => {
      const isSystem = section === Section.System;
      const isExtrinsic = method === Method.ExtrinsicFailed || method === Method.ExtrinsicSuccess;

      return isSystem && isExtrinsic;
    });

  const getDispatchInfo = () => {
    const infoEvent = getInfoEvent();

    if (infoEvent) {
      const { method, data } = infoEvent;
      const isSuccess = method === Method.ExtrinsicSuccess;
      const index = isSuccess ? 0 : 1;

      return data[index] as DispatchInfo;
    }
  };

  const { isSigned, signer } = extrinsic;
  const { weight } = getDispatchInfo() || {};

  const formattedSigner = isSigned && signer.toString();
  const formattedWeight = weight?.toHuman();
  const rowClassName = clsx(commonStyles.row, styles.row);
  const signerClassName = clsx(commonStyles.alignRight, styles.signer);

  return (
    <div className={rowClassName}>
      <div>
        <Extrinsic extrinsic={extrinsic} />
      </div>
      <div>{getEvents()}</div>
      <span className={commonStyles.alignRight}>{formattedWeight}</span>
      <span className={signerClassName}>{formattedSigner}</span>
    </div>
  );
};

export { Row };
