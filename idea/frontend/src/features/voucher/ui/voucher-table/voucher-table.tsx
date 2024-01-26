import { HexString } from '@gear-js/api';
import { useAccountProgramVoucher, useAccountVoucherBalance, useBalanceFormat } from '@gear-js/react-hooks';

import VoucherPlaceholderSVG from '@/features/voucher/assets/voucher-placeholder.svg?react';
import { ContentLoader } from '@/shared/ui/contentLoader';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';
import { withAccount } from '@/shared/ui';
import { Table, TableRow } from '@/shared/ui/table';
import { IdBlock } from '@/shared/ui/idBlock';

import { useVoucherStatus } from '../../hooks';
import styles from './voucher-table.module.scss';

type Props = {
  programId: HexString;
};

const VoucherTable = withAccount(({ programId }: Props) => {
  const { voucher, isVoucherReady } = useAccountProgramVoucher(programId);
  const { voucherBalance, isVoucherBalanceReady, isVoucherExists } = useAccountVoucherBalance(programId);

  const { isVoucherActive, expirationTimestamp, isVoucherStatusReady } = useVoucherStatus(voucher?.expiry);
  const isStatusReady = !isVoucherExists || isVoucherStatusReady;

  const { getFormattedBalance } = useBalanceFormat();
  const formattedBalance = getFormattedBalance(voucherBalance || '0');

  const getBulb = (value: boolean) => (value ? BulbStatus.Success : BulbStatus.Error);

  const getStatusText = () => {
    if (!isVoucherExists) return 'Not available';

    return isVoucherActive ? 'Available' : 'Expired';
  };

  return isVoucherReady && isVoucherBalanceReady && isStatusReady ? (
    <Table>
      <TableRow name="Status">
        <BulbBlock status={getBulb(isVoucherExists && isVoucherActive)} text={getStatusText()} size="large" />
      </TableRow>

      <TableRow name="Amount">
        <span className={styles.highlight}>{formattedBalance.value}</span>
        <span>{formattedBalance.unit}</span>
      </TableRow>

      {voucher && expirationTimestamp && (
        <>
          <TableRow name="Issued by">
            <IdBlock id={voucher.owner} size="big" />
          </TableRow>

          <TableRow name="Expire at">
            <span className={styles.highlight}>{new Date(expirationTimestamp).toLocaleString()}</span>
            <span>(#{voucher.expiry})</span>
          </TableRow>

          <TableRow name="Allow code upload">
            <BulbBlock
              status={getBulb(voucher.codeUploading)}
              text={voucher.codeUploading ? 'Enabled' : 'Disabled'}
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
