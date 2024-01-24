import { HexString } from '@gear-js/api';
import { useAccountVoucherBalance, useBalanceFormat } from '@gear-js/react-hooks';

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
  const { voucherBalance, isVoucherBalanceReady, isVoucherExists } = useAccountVoucherBalance(programId);
  const { getFormattedBalance } = useBalanceFormat();

  const status = isVoucherExists ? BulbStatus.Success : BulbStatus.Error;
  const text = isVoucherExists ? 'Available' : 'Not available';
  const formattedBalance = getFormattedBalance(voucherBalance || '0');

  return isVoucherBalanceReady ? (
    <Table>
      <TableRow name="Status">
        <BulbBlock status={status} text={text} size="large" />
      </TableRow>

      <TableRow name="Amount">
        <span className={styles.balance}>{formattedBalance.value}</span>
        <span>{formattedBalance.unit}</span>
      </TableRow>
    </Table>
  ) : (
    <ContentLoader text="There's no voucher" isEmpty={false}>
      <VoucherPlaceholderSVG />
    </ContentLoader>
  );
});

export { VoucherTable };
