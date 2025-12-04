import { Button } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { generatePath, useParams } from 'react-router-dom';

import { ProgramBalance } from '@/features/balance';
import { ProgramMessages } from '@/features/message';
import { useMetadata, MetadataTable, isState } from '@/features/metadata';
import { ProgramStatus, ProgramTable, ProgramTabs, useProgram, useProgramTab } from '@/features/program';
import { ProgramEvents, SailsPreview, useSails } from '@/features/sails';
import { ProgramVouchers } from '@/features/voucher';
import { useModal } from '@/hooks';
import AddMetaSVG from '@/shared/assets/images/actions/addMeta.svg?react';
import ReadSVG from '@/shared/assets/images/actions/read.svg?react';
import SendSVG from '@/shared/assets/images/actions/send.svg?react';
import { absoluteRoutes, routes } from '@/shared/config';
import { getShortName, isAnyKey } from '@/shared/helpers';
import { Box, UILink } from '@/shared/ui';

import styles from './program.module.scss';

type Params = {
  programId: HexString;
};

const Program = () => {
  const { programId } = useParams() as Params;
  const { showModal, closeModal } = useModal();

  const { data: program, isLoading: isProgramLoading, refetch: refetchProgram } = useProgram(programId);
  const { metadata, isMetadataReady, setMetadataHex } = useMetadata(program?.metahash);
  const { sails, isLoading: isSailsLoading, refetch: refetchSails } = useSails(program?.codeId);
  // commented out till code verified is fixed
  // const { data: isCodeVerified } = useIsCodeVerified(program?.codeId);

  const isLoading = !isMetadataReady || isSailsLoading;
  const isAnyQuery = sails ? Object.values(sails.services).some(({ queries }) => isAnyKey(queries)) : false;

  const tab = useProgramTab();

  const openUploadMetadataModal = () => {
    if (!program) throw new Error('Program is not found');
    if (!program.codeId) throw new Error('CodeId is not found'); // TODO: take a look at local program

    const onSuccess = (name: string, metadataHex?: HexString) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO(#1800): resolve eslint comments
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
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- TODO(#1800): resolve eslint comments
      onSuccess,
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headingContainer}>
          {program && <h2 className={styles.name}>{getShortName(program.name || 'Program Name')}</h2>}

          {/* commented out till code verified is fixed */}
          {/* {isCodeVerified && <VerificationStatus value="verified" />} */}
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

          {/* commented out till code verified is fixed */}
          {/* {program?.codeId && isBoolean(isCodeVerified) && !isCodeVerified && (
            <VerifyLink codeId={program.codeId} className={styles.fixWidth} />
          )} */}
        </div>
      </header>

      <ProgramTable
        program={program}
        isProgramReady={!isProgramLoading}
        renderBalance={() => <ProgramBalance id={programId} />}
      />

      <div className={styles.body}>
        <ProgramTabs value={tab.id} onChange={tab.setId} />

        {tab.isMessages && <ProgramMessages programId={programId} sails={sails} />}
        {tab.isEvents && !isSailsLoading && <ProgramEvents programId={programId} sails={sails} />}
        {tab.isVouchers && <ProgramVouchers programId={programId} />}
        {tab.isMetadata &&
          (sails ? (
            <Box>
              <SailsPreview value={sails} />
            </Box>
          ) : (
            <MetadataTable metadata={metadata} isLoading={isLoading} />
          ))}
      </div>
    </div>
  );
};

export { Program };
