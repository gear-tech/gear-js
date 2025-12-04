import { useAccount } from '@gear-js/react-hooks';

import { FilterGroup, Filters, Radio, StatusRadio } from '@/features/filters';
import { BulbStatus } from '@/shared/ui/bulbBlock';

import { DEFAULT_FILTER_VALUES, FILTER_NAME, FILTER_VALUE } from '../../consts';

type Props = {
  values: typeof DEFAULT_FILTER_VALUES;
  onSubmit: (values: typeof DEFAULT_FILTER_VALUES) => void;
};

function VoucherFilters({ values, onSubmit }: Props) {
  const { account } = useAccount();

  return (
    <Filters initialValues={DEFAULT_FILTER_VALUES} values={values} onSubmit={onSubmit}>
      <FilterGroup name={FILTER_NAME.OWNER} onSubmit={onSubmit}>
        <Radio name={FILTER_NAME.OWNER} value={FILTER_VALUE.OWNER.ALL} label="All vouchers" onSubmit={onSubmit} />

        {account && (
          <>
            <Radio name={FILTER_NAME.OWNER} value={FILTER_VALUE.OWNER.BY} label="Issued by you" onSubmit={onSubmit} />
            <Radio name={FILTER_NAME.OWNER} value={FILTER_VALUE.OWNER.TO} label="Issued to you" onSubmit={onSubmit} />
          </>
        )}
      </FilterGroup>

      <FilterGroup name={FILTER_NAME.STATUS} title="Status" onSubmit={onSubmit} withReset>
        <StatusRadio
          name={FILTER_NAME.STATUS}
          value={FILTER_VALUE.STATUS.ACTIVE}
          label="Active"
          status={BulbStatus.Success}
          onSubmit={onSubmit}
        />

        <StatusRadio
          name={FILTER_NAME.STATUS}
          value={FILTER_VALUE.STATUS.DECLINED}
          label="Declined"
          status={BulbStatus.Error}
          onSubmit={onSubmit}
        />

        <StatusRadio
          name={FILTER_NAME.STATUS}
          value={FILTER_VALUE.STATUS.EXPIRED}
          label="Expired"
          status={BulbStatus.Exited}
          onSubmit={onSubmit}
        />
      </FilterGroup>
    </Filters>
  );
}

export { VoucherFilters };
