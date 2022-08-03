import { useState } from 'react';

import { Switcher } from 'components/common/switcher';

import { SWITCHER_ITEMS, SwitcerValue } from './consts';
import { StakersList } from './stakersList';
import { UploadStakingForm } from './uploadStakingForm';

function Home() {
  const [activeValue, setActiveValue] = useState<string>(SwitcerValue.List);

  return (
    <>
      <Switcher value={activeValue} items={SWITCHER_ITEMS} onChange={setActiveValue} />
      {activeValue === SwitcerValue.Init ? <UploadStakingForm /> : <StakersList />}
    </>
  );
}

export { Home };
