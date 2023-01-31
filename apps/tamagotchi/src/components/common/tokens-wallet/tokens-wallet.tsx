import { Account } from '@gear-js/react-hooks';
import { GetTokensBalance } from 'components/common/get-tokens-balance';
import { useFTStorage } from 'app/hooks/use-ft-balance';

type Props = {
  // balance: Account['balance'];
  // address: string;
  // name: string | undefined;
  onClick: () => void;
};

export function TokensWallet({ onClick }: Props) {
  const balance = useFTStorage();
  return (
    <div className="flex gap-4 shrink-0">
      <GetTokensBalance />
      <p className="shrink-0 grid grid-cols-[auto_auto] gap-x-1 font-kanit">
        <span className="col-span-2 text-[10px] text-white text-opacity-80">Fungible Token Balance:</span>
        <span className="font-medium text-lg leading-none">{balance ? balance : '0.00'}</span>
        {/*<span className="text-sm text-white text-opacity-70">{balance.unit}</span>*/}
      </p>
    </div>
  );
}
