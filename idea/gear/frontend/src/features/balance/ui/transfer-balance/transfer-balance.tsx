import { Button } from '@gear-js/ui';

import { useModal } from '@/hooks';

import SwapSVG from '../../assets/swap.svg?react';

type Props = {
  onClick: () => void;
};

const TransferBalance = ({ onClick }: Props) => {
  // modal from a provider, cuz otherwise outside click on balance dropdown will close it
  const { showModal } = useModal();

  const handleClick = () => {
    onClick();
    showModal('transfer');
  };

  return <Button icon={SwapSVG} text="Transfer" color="grey" size="small" noWrap onClick={handleClick} />;
};

export { TransferBalance };
