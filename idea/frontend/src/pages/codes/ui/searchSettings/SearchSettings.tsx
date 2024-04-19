import { CSSTransition } from 'react-transition-group';
import { useAccount } from '@gear-js/react-hooks';

import { Filters, FilterGroup, Radio } from '@/features/filters';
import { AnimationTimeout } from '@/shared/config';
import { SearchForm } from '@/shared/ui';
import { useChain } from '@/hooks';

import styles from './SearchSettings.module.scss';
import { FiltersValues, RequestParams } from '../../model/types';

type Props = {
  isLoggedIn: boolean;
  initialValues: FiltersValues;
  onSubmit: (values: RequestParams) => void;
};

const SearchSettings = ({ isLoggedIn, initialValues, onSubmit }: Props) => {
  const { account } = useAccount();
  const { isDevChain } = useChain();

  return (
    <section className={styles.searchSettings}>
      <SearchForm
        placeholder="Search by name, id..."
        className={styles.searchForm}
        onSubmit={(query) => onSubmit({ query })}
      />

      {!isDevChain && (
        <Filters initialValues={initialValues} onSubmit={onSubmit}>
          <FilterGroup name="uploadedBy" onSubmit={onSubmit}>
            <Radio name="uploadedBy" value="none" label="All codes" onSubmit={onSubmit} />
            <CSSTransition in={isLoggedIn} exit={false} timeout={AnimationTimeout.Medium} mountOnEnter unmountOnExit>
              <Radio
                name="uploadedBy"
                value={account?.decodedAddress}
                label="My codes"
                className={styles.ownerFilter}
                onSubmit={onSubmit}
              />
            </CSSTransition>
          </FilterGroup>
        </Filters>
      )}
    </section>
  );
};

export { SearchSettings };
