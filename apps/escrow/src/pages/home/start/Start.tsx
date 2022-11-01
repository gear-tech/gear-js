import { Button } from '@gear-js/ui';
import idea from 'assets/images/icons/idea.svg';
import general from 'assets/images/icons/general.svg';

type Props = {
  text: string;
  onInit: () => void;
  onUse: () => void;
};

function Start({ text, onInit, onUse }: Props) {
  return (
    <>
      <Button text={text} icon={idea} onClick={onInit} block />
      <Button text="Use existing one" icon={general} color="light" onClick={onUse} block />
    </>
  );
}

export { Start };
