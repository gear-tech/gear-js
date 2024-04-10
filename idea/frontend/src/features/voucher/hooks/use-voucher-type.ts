import { useState, ChangeEvent } from 'react';

import { VOUCHER_TYPE, FIELD_NAME } from '../consts';
import { VoucherType } from '../types';

function useVoucherType() {
  const [type, setType] = useState<VoucherType>(VOUCHER_TYPE.PROGRAM);

  const getRadioProps = (label: string, value: string) => ({
    value,
    label,
    name: FIELD_NAME.VOUCHER_TYPE,
    checked: type === value,
    onChange: ({ target }: ChangeEvent<HTMLInputElement>) => setType(target.value as VoucherType),
  });

  return [type, getRadioProps] as const;
}

export { useVoucherType };
