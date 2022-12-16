import { Button } from '@gear-js/ui';
import { ReactComponent as idea } from 'assets/images/icons/idea.svg';
import { ReactComponent as general } from 'assets/images/icons/general.svg';

type Props = {
  text: string;
  onInit: () => void;
  onUse: () => void;
};

function Start({ text, onInit, onUse }: Props) {
  return (
    <>
      <Button text={text} icon={idea} onClick={onInit} block />
      <Button text='Use existing one' icon={general} color='light' onClick={onUse} block />
    </>
  );
}

export { Start };
