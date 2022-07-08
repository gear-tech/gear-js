import { Button } from '@gear-js/ui';

type Props = {
  text: string;
  onInit: () => void;
  onUse: () => void;
};

function Start({ text, onInit, onUse }: Props) {
  return (
    <>
      <Button text={text} onClick={onInit} block />
      <Button text="Use existing one" color="secondary" onClick={onUse} block />
    </>
  );
}

export { Start };
