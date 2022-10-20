import { FormEvent } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Input } from '@gear-js/ui';
import { useAccount } from '@gear-js/react-hooks';

import { Filters, FilterGroup, Radio } from 'features/filters';
import { AnimationTimeout } from 'shared/config';

import styles from './SearchSettings.module.scss';
import { FiltersValues } from '../../model/types';

type Props = {
  isLoggedIn: boolean;
  initialValues: FiltersValues;
  onSubmit: (values: FiltersValues) => void;
};

const SearchSettings = ({ isLoggedIn, initialValues, onSubmit }: Props) => {
  const { account } = useAccount();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // @ts-ignore
    onSubmit({ query: event.target.search.value });
  };

  return (
    <section className={styles.searchSettings}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <Input name="search" type="search" placeholder="Search by name, id..." />
      </form>
      <Filters initialValues={initialValues} onSubmit={onSubmit}>
        <FilterGroup name="uploadedBy">
          <Radio name="uploadedBy" value="none" label="All codes" />
          <CSSTransition in={isLoggedIn} exit={false} timeout={AnimationTimeout.Medium} mountOnEnter unmountOnExit>
            <Radio name="uploadedBy" value={account?.decodedAddress} label="My codes" className={styles.ownerFilter} />
          </CSSTransition>
        </FilterGroup>
        <FilterGroup name="createAt" title="Created at">
          <Input name="createAt" type="date" />
        </FilterGroup>
      </Filters>
    </section>
  );
};

export { SearchSettings };
