import { Button } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { generatePath } from 'react-router-dom';

import { useMetadataUpload, useModal } from 'hooks';
import { getShortName } from 'shared/helpers';
import { absoluteRoutes, AnimationTimeout, routes } from 'shared/config';
import { UILink } from 'shared/ui/uiLink';
import { ReactComponent as SendSVG } from 'shared/assets/images/actions/send.svg';
import { ReactComponent as ReadSVG } from 'shared/assets/images/actions/read.svg';
import { ReactComponent as AddMetaSVG } from 'shared/assets/images/actions/addMeta.svg';

import styles from './Header.module.scss';

type Props = {
  programName: string;
  programId: HexString;
  isLoading: boolean;
  isStateButtonVisible: boolean;
  isAddMetaButtonVisible: boolean;
  onMetaAdd: (metaHex: HexString, programName: string) => void;
};

const Header = ({
  programName,
  programId,
  isLoading,
  isStateButtonVisible,
  isAddMetaButtonVisible,
  onMetaAdd,
}: Props) => {
  const { showModal, closeModal } = useModal();
  const uploadMetadata = useMetadataUpload();

  const handleUploadMetadataSubmit = ({ metaHex, name }: { metaHex: HexString; name: string }) => {
    const resolve = () => {
      onMetaAdd(metaHex, name);
      closeModal();
    };

    uploadMetadata({ name, programId, metaHex, resolve });
  };

  const openUploadMetadataModal = () => showModal('metadata', { onSubmit: handleUploadMetadataSubmit });

  return (
    <section className={clsx(styles.header, isLoading && styles.loading)}>
      {!isLoading && (
        <CSSTransition in appear timeout={AnimationTimeout.Default} mountOnEnter>
          <h1 className={styles.programName}>{getShortName(programName, 36)}</h1>
        </CSSTransition>
      )}

      <div className={styles.links}>
        <UILink
          to={generatePath(absoluteRoutes.sendMessage, { programId })}
          icon={SendSVG}
          text="Send Message"
          color="secondary"
          className={styles.fixWidth}
        />

        {isStateButtonVisible && (
          <UILink
            to={generatePath(routes.state, { programId })}
            icon={ReadSVG}
            text="Read State"
            color="secondary"
            className={styles.fixWidth}
          />
        )}

        {isAddMetaButtonVisible && (
          <Button text="Add metadata" icon={AddMetaSVG} color="light" onClick={openUploadMetadataModal} />
        )}
      </div>
    </section>
  );
};

export { Header };
