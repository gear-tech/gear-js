import { CSSTransition } from 'react-transition-group';
import { Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';

import { Filters, FilterGroup, Radio, StatusCheckbox } from 'features/filters';
import { ProgramStatus, PROGRAM_STATUS_NAME } from 'entities/program';
import { AnimationTimeout } from 'shared/config';
import { BulbStatus } from 'shared/ui/bulbBlock';

import styles from './SearchSettings.module.scss';
import { FiltersValues, RequestParams } from '../../model/types';

type Props = {
  initQuery: string;
  isLoggedIn: boolean;
  initialValues: FiltersValues;
  onSubmit: (values: RequestParams) => void;
};

const SearchSettings = ({ initQuery, isLoggedIn, initialValues, onSubmit }: Props) => {
  const form = useForm({ initialValues: { query: initQuery } });

  return (
    <section className={styles.searchSettings}>
      <form className={styles.searchForm} onSubmit={form.onSubmit(({ query }) => onSubmit({ query }))}>
        <Input type="search" placeholder="Search by name, code hash, id..." {...form.getInputProps('query')} />
      </form>
      <Filters initialValues={initialValues} onSubmit={onSubmit}>
        <FilterGroup name="owner">
          <Radio name="owner" value="all" label="All programs" />
          <CSSTransition in={isLoggedIn} exit={false} timeout={AnimationTimeout.Medium} mountOnEnter unmountOnExit>
            <Radio name="owner" value="owner" label="My programs" className={styles.ownerFilter} />
          </CSSTransition>
        </FilterGroup>
        <FilterGroup title="Status" name="status" withReset>
          <StatusCheckbox
            name="status"
            value={ProgramStatus.Active}
            label={PROGRAM_STATUS_NAME[ProgramStatus.Active]}
            status={BulbStatus.Success}
          />
          <StatusCheckbox
            name="status"
            value={ProgramStatus.Paused}
            label={PROGRAM_STATUS_NAME[ProgramStatus.Paused]}
            status={BulbStatus.Loading}
          />
          <StatusCheckbox
            name="status"
            value={ProgramStatus.Terminated}
            label={PROGRAM_STATUS_NAME[ProgramStatus.Terminated]}
            status={BulbStatus.Error}
          />
        </FilterGroup>
      </Filters>
    </section>
  );
};

export { SearchSettings };
