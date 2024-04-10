import { HexString } from '@polkadot/util/types';
import { Button } from '@gear-js/ui';
import { ProgramMetadata } from '@gear-js/api';
import { useAccount, useAccountVouchers } from '@gear-js/react-hooks';
import { generatePath, useParams } from 'react-router-dom';

import { useMetadataUpload, useModal, useProgram } from '@/hooks';
import { ProgramStatus, ProgramTable } from '@/features/program';
import { ProgramMessages } from '@/widgets/programMessages';
import { PathParams } from '@/shared/types';
import { getShortName } from '@/shared/helpers';
import { Subheader } from '@/shared/ui/subheader';
import { absoluteRoutes, routes } from '@/shared/config';
import { UILink } from '@/shared/ui/uiLink';
import SendSVG from '@/shared/assets/images/actions/send.svg?react';
import ReadSVG from '@/shared/assets/images/actions/read.svg?react';
import AddMetaSVG from '@/shared/assets/images/actions/addMeta.svg?react';
import { useMetadata, MetadataTable } from '@/features/metadata';
import { IssueVoucher, VoucherTable } from '@/features/voucher';

import styles from './program.module.scss';

const Program = () => {
  const { account } = useAccount();

  const { programId } = useParams() as PathParams;
  const { showModal, closeModal } = useModal();
  const uploadMetadata = useMetadataUpload();

  const { program, isProgramReady, setProgramName } = useProgram(programId);
  const { metadata, isMetadataReady, setMetadata } = useMetadata(program?.metahash);

  const handleUploadMetadataSubmit = ({ metaHex, name }: { metaHex: HexString; name: string }) => {
    const codeHash = program?.codeId;
    if (!codeHash) return;

    const resolve = () => {
      setMetadata(ProgramMetadata.from(metaHex));
      setProgramName(name);

      closeModal();
    };

    uploadMetadata({ codeHash, metaHex, name, programId, resolve });
  };

  const openUploadMetadataModal = () => showModal('metadata', { onSubmit: handleUploadMetadataSubmit });

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

            {program.hasState && (
              <UILink
                to={generatePath(routes.state, { programId })}
                icon={ReadSVG}
                text="Read State"
                color="secondary"
                className={styles.fixWidth}
              />
            )}

            {isMetadataReady && !metadata && (
              <Button text="Add metadata" icon={AddMetaSVG} color="light" onClick={openUploadMetadataModal} />
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
            <Subheader title="Metadata" />
            <MetadataTable metadata={metadata} isLoading={!isMetadataReady} />
          </div>
        </div>

        <ProgramMessages programId={programId} />
      </div>
    </div>
  );
};

export { Program };
