import { KeyboardEvent } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Input } from '@gear-js/ui';

import { Filters } from 'features/filters';
import { ProgramStatus } from 'entities/program';
import { AnimationTimeout } from 'shared/config';
import { BulbStatus } from 'shared/ui/bulbBlock';

import styles from './SearchSettings.module.scss';
import { RequestParams } from '../../model/types';
import { FILTERS_INITIAL_VALUES } from '../../model/consts';

type Props = {
  decodedAddress?: string;
  onParamsChange: (params: RequestParams) => void;
};

const SearchSettings = ({ decodedAddress, onParamsChange }: Props) => {
  const handleEnterClick = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // @ts-ignore
      onParamsChange({ query: event.target.value });
    }
  };

  return (
    <section className={styles.searchSettings}>
      <div className={styles.searchFieldWrapper}>
        <Input placeholder="Search by name, id..." onKeyDown={handleEnterClick} />
      </div>
      <Filters initialValues={FILTERS_INITIAL_VALUES} onSubmit={onParamsChange}>
        <Filters.Group name="owner">
          <CSSTransition
            in={!!decodedAddress}
            exit={false}
            timeout={AnimationTimeout.Medium}
            mountOnEnter
            unmountOnExit>
            <Filters.Radio name="owner" value={decodedAddress} label="My programs" className={styles.ownerFilter} />
          </CSSTransition>
          <Filters.Radio name="owner" value="" label="All programs" defaultChecked />
        </Filters.Group>
        <Filters.Group name="create" title="Created at">
          <Input name="create" type="date" />
        </Filters.Group>
        <Filters.Group title="Created at" name="status" withReset>
          <Filters.StatusCheckbox
            name="status"
            value={ProgramStatus.Success}
            label={BulbStatus.Success}
            status={BulbStatus.Success}
          />
          <Filters.StatusCheckbox
            name="status"
            value={ProgramStatus.InProgress}
            label={BulbStatus.Loading}
            status={BulbStatus.Loading}
          />
          <Filters.StatusCheckbox
            name="status"
            value={ProgramStatus.Failed}
            label={BulbStatus.Error}
            status={BulbStatus.Error}
          />
        </Filters.Group>
      </Filters>
    </section>
  );
};

export { SearchSettings };
