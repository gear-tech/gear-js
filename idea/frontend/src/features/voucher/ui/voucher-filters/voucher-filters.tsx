import { FilterGroup, Filters, Radio, StatusRadio } from '@/features/filters';
import { BulbStatus } from '@/shared/ui/bulbBlock';

import { DEFAULT_FILTER_VALUES } from '../../consts';
import { useAccount } from '@gear-js/react-hooks';

type Props = {
  onSubmit: (values: typeof DEFAULT_FILTER_VALUES) => void;
  values: typeof DEFAULT_FILTER_VALUES;
};

function VoucherFilters({ onSubmit, values }: Props) {
  const { account } = useAccount();

  return (
    <Filters initialValues={DEFAULT_FILTER_VALUES} values={values} onSubmit={onSubmit}>
      <FilterGroup name="owner" onSubmit={onSubmit}>
        <Radio name="owner" value="all" label="All vouchers" onSubmit={onSubmit} />

        {account && (
          <>
            <Radio name="owner" value="by" label="Issued by you" onSubmit={onSubmit} />
            <Radio name="owner" value="to" label="Issued to you" onSubmit={onSubmit} />
          </>
        )}
      </FilterGroup>

      <FilterGroup name="status" title="Status" onSubmit={onSubmit} withReset>
        <StatusRadio name="status" value="active" label="Active" status={BulbStatus.Success} onSubmit={onSubmit} />

        <StatusRadio name="status" value="declined" label="Declined" status={BulbStatus.Error} onSubmit={onSubmit} />

        <StatusRadio name="status" value="expired" label="Expired" status={BulbStatus.Exited} onSubmit={onSubmit} />
      </FilterGroup>
    </Filters>
  );
}

export { VoucherFilters };
