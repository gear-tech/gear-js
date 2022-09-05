import { KeyboardEvent } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Input } from '@gear-js/ui';

import { Filters, FilterGroup, Radio, StatusCheckbox } from 'features/filters';
import { ProgramStatus } from 'entities/program';
import { AnimationTimeout } from 'shared/config';
import { BulbStatus } from 'shared/ui/bulbBlock';

import styles from './SearchSettings.module.scss';
import { FiltersValues } from '../../model/types';

type Props = {
  isLoggedIn: boolean;
  initialValues: FiltersValues;
  onSubmit: (values: FiltersValues) => void;
};

const SearchSettings = ({ isLoggedIn, initialValues, onSubmit }: Props) => {
  const handleEnterClick = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // @ts-ignore
      onSubmit({ query: event.target.value });
    }
  };

  return (
    <section className={styles.searchSettings}>
      <div className={styles.searchFieldWrapper}>
        <Input placeholder="Search by name, id..." onKeyDown={handleEnterClick} />
      </div>
      <Filters initialValues={initialValues} onSubmit={onSubmit}>
        <FilterGroup name="owner">
          <CSSTransition in={isLoggedIn} exit={false} timeout={AnimationTimeout.Medium} mountOnEnter unmountOnExit>
            <Radio name="owner" value="owner" label="My programs" className={styles.ownerFilter} />
          </CSSTransition>
          <Radio name="owner" value="all" label="All programs" />
        </FilterGroup>
        <FilterGroup name="createAt" title="Created at">
          <Input name="createAt" type="date" />
        </FilterGroup>
        <FilterGroup title="Status" name="status" withReset>
          <StatusCheckbox
            name="status"
            value={ProgramStatus.Success}
            label={BulbStatus.Success}
            status={BulbStatus.Success}
          />
          <StatusCheckbox
            name="status"
            value={ProgramStatus.InProgress}
            label={BulbStatus.Loading}
            status={BulbStatus.Loading}
          />
          <StatusCheckbox
            name="status"
            value={ProgramStatus.Failed}
            label={BulbStatus.Error}
            status={BulbStatus.Error}
          />
        </FilterGroup>
      </Filters>
    </section>
  );
};

export { SearchSettings };
