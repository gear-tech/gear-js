import { HexString } from '@polkadot/util/types';
import { Button } from '@gear-js/ui';
import { useAccount, useAccountVouchers } from '@gear-js/react-hooks';
import { generatePath, useParams } from 'react-router-dom';

import { useModal, useProgram } from '@/hooks';
import { ProgramStatus, ProgramTable } from '@/features/program';
import { ProgramMessages } from '@/widgets/programMessages';
import { getShortName } from '@/shared/helpers';
import { Subheader, UILink } from '@/shared/ui';
import { absoluteRoutes, routes } from '@/shared/config';
import SendSVG from '@/shared/assets/images/actions/send.svg?react';
import ReadSVG from '@/shared/assets/images/actions/read.svg?react';
import AddMetaSVG from '@/shared/assets/images/actions/addMeta.svg?react';
import { useMetadata, MetadataTable } from '@/features/metadata';
import { IssueVoucher, VoucherTable } from '@/features/voucher';
import { IDL, useSails } from '@/features/sails';

import styles from './program.module.scss';

type Params = {
  programId: HexString;
};

const Program = () => {
  const { account } = useAccount();
  const { programId } = useParams() as Params;
  const { showModal, closeModal } = useModal();

  const { program, isProgramReady, setProgramName } = useProgram(programId);
  const { metadata, isMetadataReady, setMetadataHex } = useMetadata(program?.metahash);
  const { idl, sails, isLoading: isSailsLoading, refetch: refetchSails } = useSails(program?.codeId);
  const isLoading = !isMetadataReady || isSailsLoading;
  const isAnyQuery = sails ? Object.values(sails.services).some(({ queries }) => Object.keys(queries).length) : false;

  const openUploadMetadataModal = () => {
    if (!program) throw new Error('Program is not found');
    if (!program.codeId) throw new Error('CodeId is not found'); // TODO: take a look at local program

    const onSuccess = (name: string, metadataHex?: HexString) => {
      setProgramName(name);

      return metadataHex ? setMetadataHex(metadataHex) : refetchSails();
    };

    showModal('metadata', {
      programId,
      metadataHash: program.metahash,
      codeId: program.codeId,
      onClose: closeModal,
      onSuccess,
    });
  };

  const { vouchers } = useAccountVouchers(programId);
  const voucherEntries = Object.entries(vouchers || {});
  const vouchersCount = voucherEntries.length;

  const renderVouchers = () =>
    voucherEntries.map(([id, { expiry, owner, codeUploading }]) => (
      <li key={id}>
        <VoucherTable id={id as HexString} expireBlock={expiry} owner={owner} isCodeUploadEnabled={codeUploading} />
      </li>
    ));

  return (
    <div>
      <header className={styles.header}>
        {program && <h2 className={styles.programName}>{getShortName(program.name)}</h2>}

        {program?.status === ProgramStatus.Active && (
          <div className={styles.links}>
            <UILink
              to={generatePath(absoluteRoutes.sendMessage, { programId })}
              icon={SendSVG}
              text="Send Message"
              color="secondary"
              className={styles.fixWidth}
            />

            {!isLoading && (program.hasState || isAnyQuery) && (
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

      <div className={styles.content}>
        <div className={styles.leftSide}>
          <div>
            <Subheader title="Program details" />
            <ProgramTable program={program} isProgramReady={isProgramReady} />
          </div>

          {vouchersCount > 0 && (
            <div>
              {/* TODO: WithAccount HoC? or move inside VoucherTable? */}
              {account && (
                <Subheader title={`Vouchers: ${vouchersCount}`}>
                  <IssueVoucher programId={programId} buttonColor="secondary" buttonSize="small" />
                </Subheader>
              )}

              <ul className={styles.vouchersList}>{renderVouchers()}</ul>
            </div>
          )}

          <div>
            {metadata && <Subheader title="Metadata" />}
            {idl && <Subheader title="IDL" />}

            {(metadata || isLoading) && <MetadataTable metadata={metadata} isLoading={isLoading} />}
            {/* temp solution for a placeholder */}
            {!isLoading && !metadata && !idl && <MetadataTable metadata={metadata} isLoading={isLoading} />}
            {idl && <IDL value={idl} />}
          </div>
        </div>

        <ProgramMessages programId={programId} />
      </div>
    </div>
  );
};

export { Program };
