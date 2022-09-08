import { useState, useEffect } from 'react';
import { Hex, WaitlistItem } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';

import { SwitchButton } from 'shared/ui/switchButton';

import styles from './Messages.module.scss';
import { MessageFilter } from '../../model/consts';
import { Subheader } from '../subheader';

type Props = {
  programId: Hex;
};

const Messages = ({ programId }: Props) => {
  const { api } = useApi();
  const alert = useAlert();

  const [waitlist, setWaitlist] = useState<WaitlistItem[]>();
  const [activeFilter, setActiveFilter] = useState(MessageFilter.Waitlist);

  const checkActive = (filter: MessageFilter) => filter === activeFilter;

  const switchActiveFilter = (filter: MessageFilter) => () => setActiveFilter(filter);

  useEffect(() => {
    api.waitlist
      .read(programId)
      .then(setWaitlist)
      .catch((error: Error) => alert.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.messages}>
      <Subheader title="Messages">
        <div className={styles.filters}>
          <SwitchButton
            text="Recieved: 21"
            isActive={checkActive(MessageFilter.Recieved)}
            onClick={switchActiveFilter(MessageFilter.Recieved)}
          />
          <SwitchButton
            text="Sent: 13"
            isActive={checkActive(MessageFilter.Sent)}
            onClick={switchActiveFilter(MessageFilter.Sent)}
          />
          <SwitchButton
            text="Waitlist: 4"
            isActive={checkActive(MessageFilter.Waitlist)}
            onClick={switchActiveFilter(MessageFilter.Waitlist)}
          />
        </div>
      </Subheader>
    </div>
  );
};

export { Messages };
