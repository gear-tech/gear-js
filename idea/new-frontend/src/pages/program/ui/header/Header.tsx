import { Button } from '@gear-js/ui';

import { useModal } from 'hooks';
import { getShortName } from 'shared/helpers';
import { UILink } from 'shared/ui/uiLink';
import sendSVG from 'shared/assets/images/actions/send.svg';
import readSVG from 'shared/assets/images/actions/read.svg';
import addMetadataSVG from 'shared/assets/images/actions/addMetadata.svg';

import styles from './Header.module.scss';

type Props = {
  name: string;
};

const Header = ({ name }: Props) => {
  const { showModal } = useModal();

  const showMetadataModal = () =>
    showModal('uploadFile', {
      name: 'metadata',
      redirectTo: '/',
    });

  return (
    <section id="test-header" className={styles.header}>
      <h1 className={styles.programName}>{getShortName(name, 36)}</h1>
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
