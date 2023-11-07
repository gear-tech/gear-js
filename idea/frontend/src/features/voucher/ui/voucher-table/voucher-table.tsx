import { HexString } from '@gear-js/api';
import { useBalanceFormat, useVoucher } from '@gear-js/react-hooks';

import VoucherPlaceholderSVG from '@/features/voucher/assets/voucher-placeholder.svg?react';
import { ContentLoader } from '@/shared/ui/contentLoader';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';
import { withAccount } from '@/shared/ui';
import { Table, TableRow } from '@/shared/ui/table';

import styles from './voucher-table.module.scss';

type Props = {
  programId: HexString;
};

const VoucherTable = withAccount(({ programId }: Props) => {
  const { isVoucherReady, isVoucherExists, voucherBalance } = useVoucher(programId);
  const { getFormattedBalance } = useBalanceFormat();

  const status = isVoucherExists ? BulbStatus.Success : BulbStatus.Error;
  const text = isVoucherExists ? 'Available' : 'Not available';
  const balance = voucherBalance ? getFormattedBalance(voucherBalance) : undefined;

  return isVoucherReady ? (
    <Table>
      <TableRow name="Status">
        <BulbBlock status={status} text={text} size="large" />
      </TableRow>

      <TableRow name="Amount">
        <span className={styles.balance}>{balance?.value}</span>
        <span>{balance?.unit}</span>
      </TableRow>
    </Table>
  ) : (
    <ContentLoader text="There's no voucher" isEmpty={false}>
      <VoucherPlaceholderSVG />
    </ContentLoader>
  );
});

export { VoucherTable };
