import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/app/api';

type UploadCodeFee = {
  fee: bigint;
  decimals: number;
};

export const useUploadCodeFee = () => {
  const { data: api } = useApi();

  return useQuery<UploadCodeFee>({
    queryKey: ['uploadCodeFee'],
    queryFn: async () => {
      if (!api) throw new Error('API not initialized');

      const [baseFee, extraFee, decimals] = await Promise.all([
        api.eth.router.requestCodeValidationBaseFee(),
        api.eth.router.requestCodeValidationExtraFee(),
        api.eth.wvara.decimals(),
      ]);

      return { fee: baseFee + extraFee, decimals: Number(decimals) };
    },
    enabled: Boolean(api),
  });
};
