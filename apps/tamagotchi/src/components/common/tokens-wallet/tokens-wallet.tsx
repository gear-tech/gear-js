import { GetTokensBalance } from 'components/common/get-tokens-balance';
import { useGetFTBalance } from 'app/hooks/use-ft-balance';

export function TokensWallet() {
  const { balance } = useGetFTBalance();

  return (
    <div className="flex gap-4 shrink-0">
      <GetTokensBalance />
      <p className="shrink-0 grid grid-cols-[auto_auto] gap-x-1 font-kanit">
        <span className="col-span-2 text-[10px] text-white text-opacity-80">Fungible Token Balance:</span>
        <span className="font-medium text-lg leading-none">{balance ? balance : '0.00'}</span>
      </p>
    </div>
  );
}
