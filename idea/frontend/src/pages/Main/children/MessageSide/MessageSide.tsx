import { Button } from '@gear-js/ui';

import pageStyles from '../../Main.module.scss';

import letterSVG from 'assets/images/letter.svg';

type Props = {
  onClick: () => void;
};

const MessageSide = ({ onClick }: Props) => {
  const buttonText = 'Send Message';

  return (
    <div className={pageStyles.action}>
      <div className={pageStyles.actionContent}>
        <Button icon={letterSVG} text={buttonText} color="secondary" onClick={onClick} />
        <p className={pageStyles.actionDescription}>{`Click “${buttonText}” to write and send a message`}</p>
      </div>
    </div>
  );
};

export { MessageSide };
