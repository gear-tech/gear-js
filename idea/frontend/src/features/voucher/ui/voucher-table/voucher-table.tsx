import { HexString } from '@gear-js/api';
import { useBalance, useBalanceFormat, useVoucherStatus } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { useState } from 'react';
import clsx from 'clsx';

import VoucherPlaceholderSVG from '@/features/voucher/assets/voucher-placeholder.svg?react';
import { ContentLoader } from '@/shared/ui/contentLoader';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';
import { withAccount } from '@/shared/ui';
import { Table, TableRow } from '@/shared/ui/table';
import { IdBlock } from '@/shared/ui/idBlock';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';

import styles from './voucher-table.module.scss';

type V110Props = {
  expireBlock: number;
  owner: HexString;
  isCodeUploadEnabled: boolean;
};

type DeprecatedProps = Partial<V110Props>;

type Props = { id: HexString } & (V110Props | DeprecatedProps);

const VoucherTable = withAccount(({ id, expireBlock, owner, isCodeUploadEnabled }: Props) => {
  const { isVoucherActive, expirationTimestamp, isVoucherStatusReady } = useVoucherStatus(expireBlock);

  const { balance, isBalanceReady } = useBalance(id);
  const { getFormattedBalance } = useBalanceFormat();
  const formattedBalance = getFormattedBalance(balance || '0');

  const getBulb = (value: boolean) => (value ? BulbStatus.Success : BulbStatus.Error);

  const isV110Runtime = expirationTimestamp && owner && expireBlock && isCodeUploadEnabled !== undefined;

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prevValue) => !prevValue);

  return isBalanceReady && isVoucherStatusReady ? (
    <div className={styles.table}>
      <Table>
        <TableRow name="Status">
          <BulbBlock status={getBulb(isVoucherActive)} text={isVoucherActive ? 'Available' : 'Expired'} size="large" />
        </TableRow>
        <TableRow name="Amount">
          <span className={styles.highlight}>{formattedBalance.value}</span>
          <span>{formattedBalance.unit}</span>
        </TableRow>

        {isV110Runtime && isOpen && (
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

      {isV110Runtime && (
        <Button
          icon={ArrowSVG}
          color="transparent"
          onClick={toggle}
          className={clsx(styles.openButton, isOpen && styles.open)}
        />
      )}
    </div>
  ) : (
    <ContentLoader text="There's no voucher" isEmpty={false}>
      <VoucherPlaceholderSVG />
    </ContentLoader>
  );
});

export { VoucherTable };
