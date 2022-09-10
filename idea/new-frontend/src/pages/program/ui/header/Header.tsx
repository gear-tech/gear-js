import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { Button } from '@gear-js/ui';

import { useModal } from 'hooks';
import { getShortName } from 'shared/helpers';
import { AnimationTimeout } from 'shared/config';
import { UILink } from 'shared/ui/uiLink';
import sendSVG from 'shared/assets/images/actions/send.svg';
import readSVG from 'shared/assets/images/actions/read.svg';
import addMetadataSVG from 'shared/assets/images/actions/addMetadata.svg';

import styles from './Header.module.scss';

type Props = {
  name: string;
  isLoading: boolean;
};

const Header = ({ name, isLoading }: Props) => {
  const { showModal } = useModal();

  const showMetadataModal = () =>
    showModal('uploadFile', {
      name: 'metadata',
      redirectTo: '/',
    });

  return (
    <section className={clsx(styles.header, isLoading && styles.loading)}>
      {!isLoading && (
        <CSSTransition in appear timeout={AnimationTimeout.Default} mountOnEnter>
          <h1 className={styles.programName}>{getShortName(name, 36)}</h1>
        </CSSTransition>
      )}
      <div className={styles.links}>
        <UILink to="/" icon={sendSVG} text="Send Message" color="secondary" className={styles.fixWidth} />
        <UILink to="/" icon={readSVG} text="Read State" color="secondary" className={styles.fixWidth} />
        <Button
          icon={addMetadataSVG}
          text="Add Metadata"
          color="light"
          className={styles.fixWidth}
          onClick={showMetadataModal}
        />
      </div>
    </section>
  );
};

export { Header };
