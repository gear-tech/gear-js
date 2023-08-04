import { HexString } from '@polkadot/util/types';
import { Button } from '@gear-js/ui';
import { generatePath, useParams } from 'react-router-dom';

import { useMetadataUpload, useModal, useProgram } from 'hooks';
import { ProgramMessages } from 'widgets/programMessages';
import { PathParams } from 'shared/types';
import { getShortName, isState } from 'shared/helpers';
import { Subheader } from 'shared/ui/subheader';
import { absoluteRoutes, routes } from 'shared/config';
import { UILink } from 'shared/ui/uiLink';
import { ReactComponent as SendSVG } from 'shared/assets/images/actions/send.svg';
import { ReactComponent as ReadSVG } from 'shared/assets/images/actions/read.svg';
import { ReactComponent as AddMetaSVG } from 'shared/assets/images/actions/addMeta.svg';
import { useMetadata } from 'features/metadata';

import { ProgramDetails } from './programDetails';
import { MetadataDetails } from './metadataDetails';
import styles from './Program.module.scss';

const Program = () => {
  const { programId } = useParams() as PathParams;
  const { showModal, closeModal } = useModal();
  const uploadMetadata = useMetadataUpload();

  const { program, isProgramReady, updateMeta } = useProgram(programId);
  const { metadata, isMetadataReady } = useMetadata(programId);
  const codeHash = program?.code?.id;

  const handleUploadMetadataSubmit = ({ metaHex, name }: { metaHex: HexString; name: string }) => {
    if (!codeHash) return;

    const resolve = () => {
      updateMeta(metaHex, name);
      closeModal();
    };

    uploadMetadata({ name, codeHash, metaHex, resolve });
  };

  const openUploadMetadataModal = () => showModal('metadata', { onSubmit: handleUploadMetadataSubmit });

  return (
    <div>
      <header className={styles.header}>
        {program && <h2 className={styles.programName}>{getShortName(program.name)}</h2>}

        <div className={styles.links}>
          {isProgramReady && (
            <UILink
              to={generatePath(absoluteRoutes.sendMessage, { programId })}
              icon={SendSVG}
              text="Send Message"
              color="secondary"
              className={styles.fixWidth}
            />
          )}

          {isMetadataReady && (
            <>
              {isState(metadata) && (
                <UILink
                  to={generatePath(routes.state, { programId })}
                  icon={ReadSVG}
                  text="Read State"
                  color="secondary"
                  className={styles.fixWidth}
                />
              )}

              {!metadata && (
                <Button text="Add metadata" icon={AddMetaSVG} color="light" onClick={openUploadMetadataModal} />
              )}
            </>
          )}
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.leftSide}>
          <ProgramDetails program={program} isLoading={!isProgramReady} />

          <div>
            <Subheader title="Metadata" />
            <MetadataDetails metadata={metadata} isLoading={!isMetadataReady} />
          </div>
        </div>

        <ProgramMessages programId={programId} />
      </div>
    </div>
  );
};

export { Program };
