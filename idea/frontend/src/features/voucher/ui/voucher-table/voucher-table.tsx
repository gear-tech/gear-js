import { HexString } from '@gear-js/api';
import { useAccountProgramVoucher, useAccountVoucherBalance, useBalanceFormat } from '@gear-js/react-hooks';

import VoucherPlaceholderSVG from '@/features/voucher/assets/voucher-placeholder.svg?react';
import { ContentLoader } from '@/shared/ui/contentLoader';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';
import { withAccount } from '@/shared/ui';
import { Table, TableRow } from '@/shared/ui/table';
import { IdBlock } from '@/shared/ui/idBlock';

import styles from './voucher-table.module.scss';

type Props = {
  programId: HexString;
};

const VoucherTable = withAccount(({ programId }: Props) => {
  const { voucher, isVoucherReady } = useAccountProgramVoucher(programId);
  const { voucherBalance, isVoucherBalanceReady, isVoucherExists } = useAccountVoucherBalance(programId);
  const { getFormattedBalance } = useBalanceFormat();

  const getBulbStatus = (value: boolean) => (value ? BulbStatus.Success : BulbStatus.Error);
  const getBulbText = (value: boolean) => (value ? 'Available' : 'Not available');

  const formattedBalance = getFormattedBalance(voucherBalance || '0');

  return isVoucherReady && isVoucherBalanceReady ? (
    <Table>
      <TableRow name="Status">
        <BulbBlock status={getBulbStatus(isVoucherExists)} text={getBulbText(isVoucherExists)} size="large" />
      </TableRow>

      <TableRow name="Amount">
        <span className={styles.balance}>{formattedBalance.value}</span>
        <span>{formattedBalance.unit}</span>
      </TableRow>

      {voucher && (
        <>
          <TableRow name="Issued by">
            <IdBlock id={voucher.owner} size="big" />
          </TableRow>

          <TableRow name="Expire at">Block #{voucher.expiry}</TableRow>

          <TableRow name="Allow code upload">
            <BulbBlock
              status={getBulbStatus(voucher.codeUploading)}
              text={getBulbText(voucher.codeUploading)}
              size="large"
            />
          </TableRow>
        </>
      )}
    </Table>
  ) : (
    <ContentLoader text="There's no voucher" isEmpty={false}>
      <VoucherPlaceholderSVG />
    </ContentLoader>
  );
});

export { VoucherTable };
