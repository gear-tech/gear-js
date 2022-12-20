import { Account } from '@gear-js/react-hooks';
import { TestBalanceButton } from '../test-balance-button';
import { AccountButton } from 'components/common/account-button';

type Props = {
  balance: Account['balance'];
  address: string;
  name: string | undefined;
  onClick: () => void;
};

function Wallet({ balance, address, name, onClick }: Props) {
  return (
    <div className="flex gap-4">
      <TestBalanceButton />
      <p className="shrink-0 grid grid-cols-[auto_auto] gap-x-1 font-kanit">
        <span className="col-span-2 text-[10px] text-white text-opacity-80">Balance:</span>
        <span className="font-medium text-lg leading-none">{balance.value}</span>
        <span className="text-sm text-white text-opacity-70">{balance.unit}</span>
      </p>
      <AccountButton address={address} name={name} onClick={onClick} />
    </div>
  );
}

export { Wallet };
