import { CSSTransition } from 'react-transition-group';

import { Filters, FilterGroup, Radio, StatusCheckbox } from '@/features/filters';
import { AnimationTimeout } from '@/shared/config';
import { BulbStatus } from '@/shared/ui/bulbBlock';
import { SearchForm } from '@/shared/ui';

import { ProgramStatus, PROGRAM_STATUS_NAME } from '../../consts';
import { FiltersValues, RequestParams } from '../../types';
import styles from './programs-search.module.scss';

type Props = {
  isLoggedIn: boolean;
  initialValues: FiltersValues;
  onSubmit: (values: RequestParams) => void;
};

const ProgramsSearch = ({ isLoggedIn, initialValues, onSubmit }: Props) => {
  return (
    <section className={styles.searchSettings}>
      <SearchForm
        placeholder="Search by name, code hash, id..."
        className={styles.searchForm}
        onSubmit={(query) => onSubmit({ query })}
      />

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
    </section>
  );
};

export { ProgramsSearch };
