import { CSSTransition } from 'react-transition-group';
import { Input } from '@gear-js/ui';
import { useAccount } from '@gear-js/react-hooks';
import { useForm } from '@mantine/form';

import { Filters, FilterGroup, Radio } from '@/features/filters';
import { AnimationTimeout } from '@/shared/config';
import { useChain } from '@/hooks';

import styles from './SearchSettings.module.scss';
import { FiltersValues, RequestParams } from '../../model/types';

type Props = {
  isLoggedIn: boolean;
  initialValues: FiltersValues;
  initQuery: string;
  onSubmit: (values: RequestParams) => void;
};

const SearchSettings = ({ isLoggedIn, initialValues, initQuery, onSubmit }: Props) => {
  const { account } = useAccount();
  const { isDevChain } = useChain();
  const form = useForm({ initialValues: { query: initQuery } });

  return (
    <section className={styles.searchSettings}>
      <form className={styles.searchForm} onSubmit={form.onSubmit(({ query }) => onSubmit({ query }))}>
        <Input name="search" type="search" placeholder="Search by name, id..." {...form.getInputProps('query')} />
      </form>
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
