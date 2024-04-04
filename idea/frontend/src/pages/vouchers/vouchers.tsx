import { useAccountVouchers } from '@gear-js/react-hooks';
import { Navigate } from 'react-router-dom';

import { Placeholder } from '@/entities/placeholder';
import { IssueVoucher } from '@/features/voucher';
import { routes } from '@/shared/config';
import { Subheader } from '@/shared/ui/subheader';
import { withDeprecatedFallback } from '@/shared/ui';

import VoucherCardPlaceholder from './assets/voucher-card-placeholder.svg?react';
import { VoucherCard } from './ui';
import styles from './vouchers.module.scss';

const Vouchers = withDeprecatedFallback(
  () => {
    const { vouchers, isEachVoucherReady } = useAccountVouchers();

    const voucherEntries = Object.entries(vouchers || {});
    const vouchersCount = voucherEntries.length;

    const isEmpty = isEachVoucherReady && !vouchersCount;
    const isPlaceholderVisible = isEmpty || !isEachVoucherReady;

    const renderVouchers = () =>
      voucherEntries.map(([id, { expiry, owner }]) => (
        <li key={id}>
          <VoucherCard id={id} expireBlock={expiry} owner={owner} />
        </li>
      ));

    return (
      <>
        <Subheader title={`Vouchers: ${vouchersCount}`} size="big">
          <IssueVoucher />
        </Subheader>

        {!isPlaceholderVisible ? (
          <ul className={styles.list}>{renderVouchers()}</ul>
        ) : (
          <div className={styles.placeholder}>
            <Placeholder
              block={<VoucherCardPlaceholder />}
              title="There are no vouchers yet"
              description="Wait until someone will issue a voucher for you"
              isEmpty={isEmpty}
              blocksCount={5}
            />
          </div>
        )}
      </>
    );
  },
  () => <Navigate to={routes.home} replace />,
);

export { Vouchers };
