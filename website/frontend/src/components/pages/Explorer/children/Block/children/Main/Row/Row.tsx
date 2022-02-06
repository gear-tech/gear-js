import React from 'react';
import { DispatchInfo, Event as DotEvent, Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { Methods, Sections } from 'types/explorer';
import { Event } from 'components/pages/Explorer/common/Event/Event';
import { Extrinsic } from 'components/pages/Explorer/common/Extrinsic/Extrinsic';
import styles from './Row.module.scss';

type Props = {
  extrinsic: DotExtrinsic;
  events: DotEvent[];
};

const Row = ({ extrinsic, events }: Props) => {
  const getEvents = () => events.map((event, index) => <Event key={index} event={event} />);

  const getInfoEvent = () =>
    events.find(({ section, method }) => {
      const isSystem = section === Sections.SYSTEM;
      const isExtrinsic = method === Methods.EXTRINSIC_FAILED || method === Methods.EXTRINSIC_SUCCESS;

      return isSystem && isExtrinsic;
    });

  const getDispatchInfo = () => {
    const infoEvent = getInfoEvent();

    if (infoEvent) {
      const { method, data } = infoEvent;
      const isSuccess = method === Methods.EXTRINSIC_SUCCESS;
      const index = isSuccess ? 0 : 1;

      return data[index] as DispatchInfo;
    }
  };

  const { isSigned, signer } = extrinsic;
  const { weight } = getDispatchInfo() || {};

  const formattedSigner = isSigned && signer.toString();
  const formattedWeight = weight?.toHuman();

  return (
    <>
      <div className={styles.cell}>
        <Extrinsic extrinsic={extrinsic} />
      </div>
      <div className={styles.cell}>{getEvents()}</div>
      <div className={styles.cell}>{formattedWeight}</div>
      <div className={styles.cell}>{formattedSigner}</div>
    </>
  );
};

export { Row };
