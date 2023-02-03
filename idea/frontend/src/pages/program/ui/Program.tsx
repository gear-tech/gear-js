import { useParams } from 'react-router-dom';
import { HexString } from '@polkadot/util/types';

import { useProgram } from 'hooks';
import { ProgramMessages } from 'widgets/programMessages';
import { PathParams } from 'shared/types';
import { isState } from 'shared/helpers';

import { Subheader } from 'shared/ui/subheader';
import styles from './Program.module.scss';
import { Header } from './header';
import { ProgramDetails } from './programDetails';
import { MetadataDetails } from './metadataDetails';

const Program = () => {
  const { programId } = useParams() as PathParams;

  const { program, metadata, isLoading, updateMeta } = useProgram(programId, true);
  const { messages } = program || {};

  const sortedMessages = messages?.sort(
    (message, nextMessage) => Date.parse(nextMessage.timestamp) - Date.parse(message.timestamp),
  );

  return (
    <div>
      <Header
        programName={program?.name || programId}
        programId={programId}
        isLoading={isLoading}
        isStateButtonVisible={isState(metadata)}
        isAddMetaButtonVisible={!metadata}
        onMetaAdd={updateMeta}
      />
      <div className={styles.content}>
        <div className={styles.leftSide}>
          <ProgramDetails program={program} isLoading={isLoading} />

          <div>
            <Subheader title="Metadata" />
            <MetadataDetails metadata={metadata} isLoading={isLoading} />
          </div>
        </div>
        <ProgramMessages programId={programId as HexString} messages={sortedMessages || []} isLoading={isLoading} />
      </div>
    </div>
  );
};

export { Program };
