import { FormEvent } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Input } from '@gear-js/ui';

import { OwnerFilter } from 'api/consts';
import { Filters, FilterGroup, Radio, Checkbox } from 'features/filters';
import { AnimationTimeout } from 'shared/config';

import styles from './SearchSettings.module.scss';
import { FiltersValues } from '../../model/types';

type Props = {
  isLoggedIn: boolean;
  initialValues: FiltersValues;
  onSubmit: (values: FiltersValues) => void;
};

const SearchSettings = ({ isLoggedIn, initialValues, onSubmit }: Props) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // @ts-ignore
    onSubmit({ query: event.target.search.value });
  };

  return (
    <section className={styles.searchSettings}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <Input name="search" type="search" placeholder="Search by program ID, message ID..." />
      </form>
      <Filters initialValues={initialValues} onSubmit={onSubmit}>
        <FilterGroup name="destination">
          <CSSTransition in={isLoggedIn} exit={false} timeout={AnimationTimeout.Medium} mountOnEnter unmountOnExit>
            <Radio name="destination" value={OwnerFilter.User} label="My messages" className={styles.ownerFilter} />
          </CSSTransition>
          <Radio name="destination" value={OwnerFilter.All} label="All messages" />
        </FilterGroup>
        <FilterGroup name="createAt" title="Created at">
          <Input name="createAt" type="date" />
        </FilterGroup>
        <FilterGroup title="Location" name="location" withReset>
          <Checkbox name="location" value="sent message" label="Sent messages" />
          <Checkbox name="location" value="recieved messages" label="Received messages" />
        </FilterGroup>
      </Filters>
    </section>
  );
};

export { SearchSettings };
