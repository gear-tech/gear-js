import { CSSTransition } from 'react-transition-group';
import { Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';

import { Filters, FilterGroup, Radio, StatusCheckbox } from '@/features/filters';
import { AnimationTimeout } from '@/shared/config';
import { BulbStatus } from '@/shared/ui/bulbBlock';

import { ProgramStatus, PROGRAM_STATUS_NAME } from '../../consts';
import { FiltersValues, RequestParams } from '../../types';
import styles from './programs-search.module.scss';

type Props = {
  initQuery: string;
  isLoggedIn: boolean;
  initialValues: FiltersValues;
  onSubmit: (values: RequestParams) => void;
};

const ProgramsSearch = ({ initQuery, isLoggedIn, initialValues, onSubmit }: Props) => {
  const form = useForm({ initialValues: { query: initQuery } });

  return (
    <section className={styles.searchSettings}>
      <form className={styles.searchForm} onSubmit={form.onSubmit(({ query }) => onSubmit({ query }))}>
        <Input type="search" placeholder="Search by name, code hash, id..." {...form.getInputProps('query')} />
      </form>
      <Filters initialValues={initialValues} onSubmit={onSubmit}>
        <FilterGroup name="owner" onSubmit={onSubmit}>
          <Radio name="owner" value="all" label="All programs" onSubmit={onSubmit} />
          <CSSTransition in={isLoggedIn} exit={false} timeout={AnimationTimeout.Medium} mountOnEnter unmountOnExit>
            <Radio name="owner" value="owner" label="My programs" className={styles.ownerFilter} onSubmit={onSubmit} />
          </CSSTransition>
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
            value={ProgramStatus.Exited}
            label={PROGRAM_STATUS_NAME[ProgramStatus.Exited]}
            status={BulbStatus.Exited}
            onSubmit={onSubmit}
          />
        </FilterGroup>
      </Filters>
    </section>
  );
};

export { ProgramsSearch };
