import { HexString } from '@gear-js/api';
import { useBalance, useBalanceFormat } from '@gear-js/react-hooks';

import VoucherPlaceholderSVG from '@/features/voucher/assets/voucher-placeholder.svg?react';
import { ContentLoader } from '@/shared/ui/contentLoader';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';
import { withAccount } from '@/shared/ui';
import { Table, TableRow } from '@/shared/ui/table';
import { IdBlock } from '@/shared/ui/idBlock';

import { useVoucherStatus } from '../../hooks';
import styles from './voucher-table.module.scss';

type Props = {
  id: HexString;
  expireBlock: number;
  owner: HexString;
  isCodeUploadEnabled: boolean;
};

const VoucherTable = withAccount(({ id, expireBlock, owner, isCodeUploadEnabled }: Props) => {
  const { isVoucherActive, expirationTimestamp, isVoucherStatusReady } = useVoucherStatus(expireBlock);

  const { balance, isBalanceReady } = useBalance(id);
  const { getFormattedBalance } = useBalanceFormat();
  const formattedBalance = getFormattedBalance(balance || '0');

  const getBulb = (value: boolean) => (value ? BulbStatus.Success : BulbStatus.Error);

  return isBalanceReady && isVoucherStatusReady ? (
    <Table>
      <TableRow name="Status">
        <BulbBlock status={getBulb(isVoucherActive)} text={isVoucherActive ? 'Available' : 'Expired'} size="large" />
      </TableRow>

      <TableRow name="Amount">
        <span className={styles.highlight}>{formattedBalance.value}</span>
        <span>{formattedBalance.unit}</span>
      </TableRow>

      {expirationTimestamp && (
        <>
          <TableRow name="Issued by">
            <IdBlock id={owner} size="big" />
          </TableRow>

          <TableRow name="Expire at">
            <span className={styles.highlight}>{new Date(expirationTimestamp).toLocaleString()}</span>
            <span>(#{expireBlock})</span>
          </TableRow>

          <TableRow name="Allow code upload">
            <BulbBlock
              status={getBulb(isCodeUploadEnabled)}
              text={isCodeUploadEnabled ? 'Enabled' : 'Disabled'}
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
