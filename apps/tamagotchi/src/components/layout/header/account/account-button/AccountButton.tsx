import Identicon from '@polkadot/react-identicon';
import clsx from 'clsx';
import { Button, buttonStyles } from '@gear-js/ui';

type Props = {
  address: string;
  name: string | undefined;
  onClick: () => void;
  isActive?: boolean;
  block?: boolean;
};

export const AccountButton = ({ address, name, onClick, isActive }: Props) => {
  return (
    <Button
      className={clsx('w-full !justify-start', isActive ? buttonStyles.primary : buttonStyles.light)}
      text={name}
      onClick={onClick}
      icon={() => (
        <>
          <Identicon value={address} className={buttonStyles.icon} theme="polkadot" size={28} />
        </>
      )}
    />
  );
};
