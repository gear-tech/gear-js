import { Skeleton, List } from '@/shared/ui';

import VoucherCardPlaceholder from '../../assets/voucher-card-placeholder.svg?react';
import { VoucherCard } from '../voucher-card';
import { Voucher } from '../../api/types';

type Props = {
  items: Voucher[] | undefined;
  isLoading: boolean;
  hasMore: boolean;
  noItemsSubheading?: string;
  size?: 'small';
  onVoucherChange: () => void;
  fetchMore: () => void;
};

function Vouchers({ onVoucherChange, noItemsSubheading, ...props }: Props) {
  const renderVoucher = (voucher: Voucher) => <VoucherCard voucher={voucher} onChange={onVoucherChange} />;
  const renderSkeleton = () => <Skeleton SVG={VoucherCardPlaceholder} disabled={true} />;

  return (
    <List
      {...props}
      noItems={{ heading: 'There are no vouchers yet', subheading: noItemsSubheading }}
      renderItem={renderVoucher}
      renderSkeleton={renderSkeleton}
    />
  );
}

export { Vouchers };
