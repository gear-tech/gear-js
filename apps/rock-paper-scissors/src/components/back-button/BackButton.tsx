import { Button } from '@gear-js/ui';
import {ReactComponent as BackSVG} from 'assets/images/icons/back.svg';

type Props = {
  onClick: () => void;
};

function BackButton({ onClick }: Props) {
  return <Button icon={BackSVG} text="Back" color="light" size="large" onClick={onClick} />;
}

export { BackButton };
