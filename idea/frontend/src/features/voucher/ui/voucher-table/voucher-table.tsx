import { HexString } from '@gear-js/api';

import { ReactComponent as VoucherPlaceholderSVG } from 'features/voucher/assets/voucher-placeholder.svg';
import { ContentLoader } from 'pages/program/ui/contentLoader';
import { BulbBlock, BulbStatus } from 'shared/ui/bulbBlock';
import { Table, TableRow } from 'shared/ui/table';

import { useAccount } from '@gear-js/react-hooks';
import { useVoucher } from '../../hooks';
import styles from './voucher-table.module.scss';

type Props = {
  programId: HexString;
};

const VoucherTable = ({ programId }: Props) => {
  const { account } = useAccount();

  const { isVoucherReady, isVoucherExists, voucherBalance } = useVoucher(programId);
  const status = isVoucherExists ? BulbStatus.Success : BulbStatus.Error;
  const text = isVoucherExists ? 'Available' : 'Not available';

  return isVoucherReady ? (
    <Table>
      <TableRow name="Status">
        <BulbBlock status={status} text={text} size="large" />
      </TableRow>

      <TableRow name="Amount">
        <span className={styles.balance}>{voucherBalance}</span>
        <span>{account?.balance.unit}</span>
      </TableRow>
    </Table>
  ) : (
    <ContentLoader text="There's no voucher" isEmpty={false}>
      <VoucherPlaceholderSVG />
    </ContentLoader>
  );
};

export { VoucherTable };
