import { HexString } from '@polkadot/util/types';
import { Button } from '@gear-js/ui';
import cx from 'clsx';
import { useState } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { useModal } from '@/hooks';
import { ProgramStatus, ProgramTable, useProgram } from '@/features/program';
import { getShortName, isAnyKey } from '@/shared/helpers';
import { Box, UILink } from '@/shared/ui';
import { absoluteRoutes, routes } from '@/shared/config';
import SendSVG from '@/shared/assets/images/actions/send.svg?react';
import ReadSVG from '@/shared/assets/images/actions/read.svg?react';
import AddMetaSVG from '@/shared/assets/images/actions/addMeta.svg?react';
import { useMetadata, MetadataTable, isState } from '@/features/metadata';
import { ProgramVouchers } from '@/features/voucher';
import { ProgramEvents, SailsPreview, useSails } from '@/features/sails';
import { ProgramMessages } from '@/features/message';
import { ProgramBalance } from '@/features/balance';
import { useIsCodeVerified, VerificationStatus, VerifyLink } from '@/features/code-verifier';

import styles from './program.module.scss';

const TABS = ['Metadata/Sails', 'Messages', 'Events', 'Vouchers'];

type Params = {
  programId: HexString;
};

const Program = () => {
  const { programId } = useParams() as Params;
  const { showModal, closeModal } = useModal();

  const { data: program, isLoading: isProgramLoading, refetch: refetchProgram } = useProgram(programId);
  const { metadata, isMetadataReady, setMetadataHex } = useMetadata(program?.metahash);
  const { sails, isLoading: isSailsLoading, refetch: refetchSails } = useSails(program?.codeId);
  const { data: isCodeVerified } = useIsCodeVerified(program?.codeId);

  const isLoading = !isMetadataReady || isSailsLoading;
  const isAnyQuery = sails ? Object.values(sails.services).some(({ queries }) => isAnyKey(queries)) : false;

  const [tabIndex, setTabIndex] = useState(0);

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
        <div className={styles.headingContainer}>
          {program && <h2 className={styles.name}>{getShortName(program.name || 'Program Name')}</h2>}
          {!isCodeVerified && <VerificationStatus value="verified" />}
        </div>

        <div className={styles.links}>
          {program?.status === ProgramStatus.Active && (
            <>
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

              {!isLoading && !metadata && !sails && (
                <Button text="Add metadata" icon={AddMetaSVG} color="light" onClick={openUploadMetadataModal} />
              )}
            </>
          )}

          {program?.codeId && typeof isCodeVerified === 'boolean' && !isCodeVerified && (
            <VerifyLink codeId={program.codeId} className={styles.fixWidth} />
          )}
        </div>
      </header>

      <ProgramTable
        program={program}
        isProgramReady={!isProgramLoading}
        renderBalance={() => <ProgramBalance id={programId} />}
      />

      <div className={styles.body}>
        <header className={styles.tabs}>{renderTabs()}</header>

        {tabIndex === 0 &&
          (sails ? (
            <Box>
              <SailsPreview value={sails} />
            </Box>
          ) : (
            <MetadataTable metadata={metadata} isLoading={isLoading} />
          ))}

        {tabIndex === 1 && <ProgramMessages programId={programId} sails={sails} />}
        {tabIndex === 2 && !isSailsLoading && <ProgramEvents programId={programId} sails={sails} />}
        {tabIndex === 3 && <ProgramVouchers programId={programId} />}
      </div>
    </div>
  );
};

export { Program };
