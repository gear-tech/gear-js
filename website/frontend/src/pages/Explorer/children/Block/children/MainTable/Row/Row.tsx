import clsx from 'clsx';
import { DispatchInfo, Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { IdeaEvents, Methods, Sections } from 'types/explorer';
import { Event } from 'pages/Explorer/common/Event/Event';
import { Extrinsic } from 'pages/Explorer/common/Extrinsic/Extrinsic';
import styles from './Row.module.scss';

type Props = {
  extrinsic: DotExtrinsic;
  events: IdeaEvents;
};

const Row = ({ extrinsic, events }: Props) => {
  // eslint-disable-next-line react/no-array-index-key
  const getEvents = () => events.map((event, index) => <Event key={index} value={event} className={styles.event} />);

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
  const textClassName = clsx(styles.cell, styles.text);

  return (
    <>
      <div className={styles.cell}>
        <Extrinsic extrinsic={extrinsic} className={styles.event} />
      </div>
      <div className={styles.cell}>{getEvents()}</div>
      <div className={textClassName}>{formattedWeight}</div>
      <div className={textClassName}>{formattedSigner}</div>
    </>
  );
};

export { Row };
