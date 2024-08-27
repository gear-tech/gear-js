import { useAccount } from '@gear-js/react-hooks';
import { useEzTransactions } from '../context';

const usePrepareEzTransactionParams = () => {
  const gasLimit = 250_000_000_000n;
  const { account } = useAccount();
  const { signless, gasless } = useEzTransactions();
  const { pair, voucher } = signless;

  const prepareEzTransactionParams = async (sendFromBaseAccount?: boolean) => {
    if (!account) throw new Error('Account not found');

    const sendFromPair = pair && voucher?.id && !sendFromBaseAccount;
    const sessionForAccount = sendFromPair ? account.decodedAddress : null;

    let voucherId = sendFromPair ? voucher?.id : gasless.voucherId;
    if (account && gasless.isEnabled && !gasless.voucherId && !signless.isActive) {
      voucherId = await gasless.requestVoucher(account.address);
    }

    return {
      sessionForAccount,
      account: sendFromPair ? { addressOrPair: pair } : undefined,
      voucherId,
      gasLimit,
    };
  };

  return { prepareEzTransactionParams };
};

export { usePrepareEzTransactionParams };
