import { Button } from '@gear-js/ui';
import back from 'assets/images/icons/back.svg';

type Props = {
  onClick: () => void;
};

function BackButton({ onClick }: Props) {
  return <Button icon={back} text="Back" color="light" size="large" onClick={onClick} />;
}

export { BackButton };
