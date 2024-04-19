import { CSSTransition } from 'react-transition-group';

import { Filters, FilterGroup, Radio } from '@/features/filters';
import { AnimationTimeout } from '@/shared/config';
import { SearchForm } from '@/shared/ui';

import { FiltersValues, ParamsValues } from '../../model/types';
import styles from './SearchSettings.module.scss';

type Props = {
  isLoggedIn: boolean;
  initialValues: FiltersValues;
  onSubmit: (values: ParamsValues) => void;
};

const SearchSettings = ({ isLoggedIn, initialValues, onSubmit }: Props) => {
  return (
    <section className={styles.searchSettings}>
      <SearchForm
        placeholder="Search by id, source, destination..."
        className={styles.searchForm}
        onSubmit={(query) => onSubmit({ query })}
      />

      <Filters initialValues={initialValues} onSubmit={onSubmit}>
        <FilterGroup name="owner" onSubmit={onSubmit}>
          <Radio name="owner" value="all" label="All messages" onSubmit={onSubmit} />
          <CSSTransition in={isLoggedIn} exit={false} timeout={AnimationTimeout.Medium} mountOnEnter unmountOnExit>
            <>
              <Radio
                name="owner"
                value="source"
                label="Sent messages"
                className={styles.ownerFilter}
                onSubmit={onSubmit}
              />
              <Radio
                name="owner"
                value="destination"
                label="Received messages"
                className={styles.ownerFilter}
                onSubmit={onSubmit}
              />
            </>
          </CSSTransition>
        </FilterGroup>
      </Filters>
    </section>
  );
};

export { SearchSettings };
