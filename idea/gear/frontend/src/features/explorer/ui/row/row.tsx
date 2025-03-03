import { DispatchInfo, Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import clsx from 'clsx';

import commonStyles from '@/pages/explorer/explorer.module.scss';

import { Method, Section } from '../../consts';
import { IdeaEvent } from '../../idea-event';
import { FormattedMessageQueuedData } from '../../types';
import { BlockEvent } from '../block-event';
import { Extrinsic } from '../extrinsic';

import styles from './row.module.scss';

type Props = {
  extrinsic: DotExtrinsic;
  events: IdeaEvent[] | undefined;
};

const Row = ({ extrinsic, events }: Props) => {
  const getEvents = () => events?.map((event, index) => <BlockEvent key={index} value={event} />);

  const getInfoEvent = () =>
    events?.find(({ section, method }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- TODO(#1800): resolve eslint comments
      const isSystem = section === Section.System;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- TODO(#1800): resolve eslint comments
      const isExtrinsic = method === Method.ExtrinsicFailed || method === Method.ExtrinsicSuccess;

      return isSystem && isExtrinsic;
    });

  const getDispatchInfo = () => {
    const infoEvent = getInfoEvent();

    if (infoEvent) {
      const { method, data } = infoEvent;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- TODO(#1800): resolve eslint comments
      const isSuccess = method === Method.ExtrinsicSuccess;
      const index = isSuccess ? 0 : 1;

      return data[index] as DispatchInfo;
    }
  };

  const { isSigned, signer } = extrinsic;
  const { weight } = getDispatchInfo() || {};

  const formattedSigner = isSigned && (signer.toHuman() as { Id: string });
  const formattedWeight = weight && (weight.toHuman() as { refTime: string; proofSize: string });
  const rowClassName = clsx(commonStyles.row, styles.row);
  const signerClassName = clsx(commonStyles.alignRight, styles.signer);

  // get programId for extrinsics decoding
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- TODO(#1800): resolve eslint comments
  const messageQueued = events?.find(({ method }) => method === Method.MessageQueued);
  const formattedMessageQueued = messageQueued?.toHuman() as FormattedMessageQueuedData | undefined;

  return (
    <div className={rowClassName}>
      <div>
        <Extrinsic extrinsic={extrinsic} programId={formattedMessageQueued?.data.destination} />
      </div>
      <div>{getEvents()}</div>
      <span className={commonStyles.alignRight}>{formattedWeight && formattedWeight.refTime}</span>
      <span className={signerClassName}>{formattedSigner && formattedSigner.Id}</span>
    </div>
  );
};

export { Row };
