import { HexString } from '@gear-js/api';
import { useAccount, useBalanceFormat, useVoucher } from '@gear-js/react-hooks';

import { ReactComponent as VoucherPlaceholderSVG } from 'features/voucher/assets/voucher-placeholder.svg';
import { ContentLoader } from 'shared/ui/contentLoader';
import { BulbBlock, BulbStatus } from 'shared/ui/bulbBlock';
import { Table, TableRow } from 'shared/ui/table';

import { withAccount } from '../../hooks';
import styles from './voucher-table.module.scss';

type Props = {
  programId: HexString;
};

const VoucherTable = withAccount(({ programId }: Props) => {
  const { account } = useAccount();
  const { getFormattedBalanceValue } = useBalanceFormat();

  const { isVoucherReady, isVoucherExists, voucherBalance } = useVoucher(programId);
  const status = isVoucherExists ? BulbStatus.Success : BulbStatus.Error;
  const text = isVoucherExists ? 'Available' : 'Not available';

  return isVoucherReady ? (
    <Table>
      <TableRow name="Status">
        <BulbBlock status={status} text={text} size="large" />
      </TableRow>

      <TableRow name="Amount">
        <span className={styles.balance}>{voucherBalance && getFormattedBalanceValue(voucherBalance).toFixed()}</span>
        <span>{account?.balance.unit}</span>
      </TableRow>
    </Table>
  ) : (
    <ContentLoader text="There's no voucher" isEmpty={false}>
      <VoucherPlaceholderSVG />
    </ContentLoader>
  );
});

export { VoucherTable };
