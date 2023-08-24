import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useEffect, useState } from 'react';

import actionLinkStyles from 'shared/ui/ActionLink/ActionLink.module.scss';

import { ReactComponent as CouponSVG } from '../../assets/coupon.svg';
import styles from './CreateVoucher.module.scss';

type Props = {
  programId: HexString;
};

const CreateVoucher = ({ programId }: Props) => {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const { account } = useAccount();
  const accountAddress = account?.decodedAddress;

  const [isVoucherExists, setIsVoucherExists] = useState<boolean>();

  useEffect(() => {
    if (!isApiReady || !accountAddress) return;

    api.voucher
      .exists(programId, accountAddress)
      .then((result) => setIsVoucherExists(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, accountAddress]);

  return !isVoucherExists ? (
    <Button
      icon={CouponSVG}
      text="Create Voucher"
      color="transparent"
      size="small"
      className={actionLinkStyles.link}
      noWrap
    />
  ) : null;
};

export { CreateVoucher };
