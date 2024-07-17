import { Skeleton, List } from '@/shared/ui';

import VoucherCardPlaceholder from '../../assets/voucher-card-placeholder.svg?react';
import { Voucher } from '../../types';
import { VoucherCard } from '../voucher-card';

type Props = {
  list: Voucher[] | undefined;
  isLoading: boolean;
  hasMore: boolean;
  onVoucherChange: () => void;
  fetchMore: () => void;
};

function Vouchers({ list, isLoading, hasMore, onVoucherChange, fetchMore }: Props) {
  const renderVoucher = (voucher: Voucher) => <VoucherCard voucher={voucher} onChange={onVoucherChange} />;
  const renderSkeleton = () => <Skeleton SVG={VoucherCardPlaceholder} disabled={true} />;

  return (
    <List
      items={list}
      hasMore={hasMore}
      isLoading={isLoading}
      renderItem={renderVoucher}
      renderSkeleton={renderSkeleton}
      fetchMore={fetchMore}
    />
  );
}

export { Vouchers };
