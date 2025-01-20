import { useAccount } from '@gear-js/react-hooks';

import { OwnerFilter } from '@/api/consts';
import { Filters, FilterGroup, Radio, StatusCheckbox } from '@/features/filters';
import { BulbStatus } from '@/shared/ui';

import { ProgramStatus, PROGRAM_STATUS_NAME, DEFAULT_FILTER_VALUES } from '../../consts';

type Props = {
  defaultValues: typeof DEFAULT_FILTER_VALUES;
  onSubmit: (values: typeof DEFAULT_FILTER_VALUES) => void;
};

const ProgramFilters = ({ defaultValues, onSubmit }: Props) => {
  const { account } = useAccount();

  return (
    <Filters initialValues={defaultValues} onSubmit={onSubmit}>
      <FilterGroup name="owner" onSubmit={onSubmit}>
        <Radio name="owner" value={OwnerFilter.All} label="All programs" onSubmit={onSubmit} />

        {account && <Radio name="owner" value={OwnerFilter.User} label="My programs" onSubmit={onSubmit} />}
      </FilterGroup>

      <FilterGroup title="Status" name="status" withReset onSubmit={onSubmit}>
        <StatusCheckbox
          name="status"
          value={ProgramStatus.Active}
          label={PROGRAM_STATUS_NAME[ProgramStatus.Active]}
          status={BulbStatus.Success}
          onSubmit={onSubmit}
        />
        <StatusCheckbox
          name="status"
          value={ProgramStatus.Paused}
          label={PROGRAM_STATUS_NAME[ProgramStatus.Paused]}
          status={BulbStatus.Loading}
          onSubmit={onSubmit}
        />
        <StatusCheckbox
          name="status"
          value={ProgramStatus.Terminated}
          label={PROGRAM_STATUS_NAME[ProgramStatus.Terminated]}
          status={BulbStatus.Error}
          onSubmit={onSubmit}
        />
        <StatusCheckbox
          name="status"
          value={ProgramStatus.ProgramSet}
          label={PROGRAM_STATUS_NAME[ProgramStatus.ProgramSet]}
          status={BulbStatus.Exited}
          onSubmit={onSubmit}
        />
        <StatusCheckbox
          name="status"
          value={ProgramStatus.Exited}
          label={PROGRAM_STATUS_NAME[ProgramStatus.Exited]}
          status={BulbStatus.Exited}
          onSubmit={onSubmit}
        />
      </FilterGroup>
    </Filters>
  );
};

export { ProgramFilters };
