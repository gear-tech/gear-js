import { HexString } from '@polkadot/util/types';
import { Button } from '@gear-js/ui';
import cx from 'clsx';
import { useState } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { useModal } from '@/hooks';
import { ProgramStatus, ProgramTable, useProgram } from '@/features/program';
import { getShortName } from '@/shared/helpers';
import { UILink } from '@/shared/ui';
import { absoluteRoutes, routes } from '@/shared/config';
import SendSVG from '@/shared/assets/images/actions/send.svg?react';
import ReadSVG from '@/shared/assets/images/actions/read.svg?react';
import AddMetaSVG from '@/shared/assets/images/actions/addMeta.svg?react';
import { useMetadata, MetadataTable, isState } from '@/features/metadata';
import { ProgramVouchers } from '@/features/voucher';
import { IDL, ProgramEvents, useSails } from '@/features/sails';
import { ProgramMessages } from '@/features/message';

import styles from './program.module.scss';

type Params = {
  programId: HexString;
};

const TABS = ['Metadata/Sails', 'Messages', 'Vouchers', 'Events'];

const Program = () => {
  const { programId } = useParams() as Params;
  const { showModal, closeModal } = useModal();

  const { data: program, isLoading: isProgramLoading, refetch: refetchProgram } = useProgram(programId);
  const { metadata, isMetadataReady, setMetadataHex } = useMetadata(program?.metahash);
  const { idl, sails, isLoading: isSailsLoading, refetch: refetchSails } = useSails(program?.codeId);
  const isLoading = !isMetadataReady || isSailsLoading;
  const isAnyQuery = sails ? Object.values(sails.services).some(({ queries }) => Object.keys(queries).length) : false;

  const [tabIndex, setTabIndex] = useState(3);

  const openUploadMetadataModal = () => {
    if (!program) throw new Error('Program is not found');
    if (!program.codeId) throw new Error('CodeId is not found'); // TODO: take a look at local program

    const onSuccess = (name: string, metadataHex?: HexString) => {
      if (name) refetchProgram();

      return metadataHex ? setMetadataHex(metadataHex) : refetchSails();
    };

    // if program is not saved in storage, we can't change the name.
    // kinda tricky, treat carefully. worth to consider different approach
    const isStorageProgram = 'blockHash' in program;

    showModal('metadata', {
      programId,
      metadataHash: program.metahash,
      codeId: program.codeId,
      isNameEditable: isStorageProgram,
      onClose: closeModal,
      onSuccess,
    });
  };

  const renderTabs = () =>
    TABS.map((tab, index) => (
      <button
        key={tab}
        type="button"
        onClick={() => setTabIndex(index)}
        className={cx(styles.button, index === tabIndex && styles.active)}>
        {tab}
      </button>
    ));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* why program name is nullable? */}
        {program && <h2 className={styles.name}>{getShortName(program.name || '')}</h2>}

        {program?.status === ProgramStatus.Active && (
          <div className={styles.links}>
            <UILink
              to={generatePath(absoluteRoutes.sendMessage, { programId })}
              icon={SendSVG}
              text="Send Message"
              color="secondary"
              className={styles.fixWidth}
            />

            {!isLoading && (isState(metadata) || isAnyQuery) && (
              <UILink
                to={generatePath(metadata ? routes.state : routes.sailsState, { programId })}
                icon={ReadSVG}
                text="Read State"
                color="secondary"
                className={styles.fixWidth}
              />
            )}

            {!isLoading && !metadata && !idl && (
              <Button text="Add metadata/sails" icon={AddMetaSVG} color="light" onClick={openUploadMetadataModal} />
            )}
          </div>
        )}
      </header>

      <ProgramTable program={program} isProgramReady={!isProgramLoading} />

      <div>
        <header className={styles.tabs}>{renderTabs()}</header>

        {tabIndex === 0 && (
          <>
            {metadata && <MetadataTable metadata={metadata} isLoading={isLoading} />}
            {idl && <IDL value={idl} />}
          </>
        )}

        {tabIndex === 1 && <ProgramMessages programId={programId} />}
        {tabIndex === 2 && <ProgramVouchers programId={programId} />}
        {tabIndex === 3 && <ProgramEvents programId={programId} />}
      </div>
    </div>
  );
};

export { Program };
