import { FormEvent } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Input } from '@gear-js/ui';

import { Filters, FilterGroup, Radio } from 'features/filters';
import { AnimationTimeout } from 'shared/config';

import { FiltersValues } from '../../model/types';
import styles from './SearchSettings.module.scss';

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
        <Input name="search" type="search" placeholder="Search by id, source, destination..." />
      </form>
      <Filters initialValues={initialValues} onSubmit={onSubmit}>
        <FilterGroup name="owner">
          <Radio name="owner" value="all" label="All messages" />
          <CSSTransition in={isLoggedIn} exit={false} timeout={AnimationTimeout.Medium} mountOnEnter unmountOnExit>
            <>
              <Radio name="owner" value="source" label="Sent messages" className={styles.ownerFilter} />
              <Radio name="owner" value="destination" label="Received messages" className={styles.ownerFilter} />
            </>
          </CSSTransition>
        </FilterGroup>
      </Filters>
    </section>
  );
};

export { SearchSettings };
