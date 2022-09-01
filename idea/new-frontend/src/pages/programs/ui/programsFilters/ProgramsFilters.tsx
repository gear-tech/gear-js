import { CSSTransition } from 'react-transition-group';
import { Input } from '@gear-js/ui';

import { Filters } from 'features/filters';
import { ProgramStatus } from 'entities/program';
import { AnimationTimeout } from 'shared/config';
import { BulbStatus } from 'shared/ui/bulbBlock';

// import { FiltersValues } from '../../model/types';
import styles from './ProgramsFilters.module.scss';
import { FILTERS_INITIAL_VALUES } from '../../model/consts';

type Props = {
  decodedAddress?: string;
};

const ProgramsFilters = ({ decodedAddress }: Props) => {
  const handleSubmit = () => {};

  return (
    <Filters initialValues={FILTERS_INITIAL_VALUES} searchPlaceholder="Search by name, id..." onSubmit={handleSubmit}>
      <Filters.FilterGroup name="owner">
        <CSSTransition in={!!decodedAddress} exit={false} timeout={AnimationTimeout.Medium} mountOnEnter unmountOnExit>
          <Filters.Radio name="owner" value={decodedAddress} label="My programs" className={styles.ownerFilter} />
        </CSSTransition>
        <Filters.Radio name="owner" value="" label="All programs" defaultChecked />
      </Filters.FilterGroup>
      <Filters.FilterGroup name="create" title="Created at">
        <Input name="create" type="date" />
      </Filters.FilterGroup>
      <Filters.FilterGroup title="Created at" name="status" withReset>
        <Filters.StatusCheckbox
          name="status"
          value={ProgramStatus.Success}
          label={BulbStatus.Success}
          status={BulbStatus.Success}
        />
        <Filters.StatusCheckbox
          name="status"
          value={ProgramStatus.InProgress}
          label={BulbStatus.Loading}
          status={BulbStatus.Loading}
        />
        <Filters.StatusCheckbox
          name="status"
          value={ProgramStatus.Failed}
          label={BulbStatus.Error}
          status={BulbStatus.Error}
        />
      </Filters.FilterGroup>
    </Filters>
  );
};

export { ProgramsFilters };
