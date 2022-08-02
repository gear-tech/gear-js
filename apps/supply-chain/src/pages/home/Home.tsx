import { useState } from 'react';
import { Hex } from '@gear-js/api';
import { useSupplyChainUpload } from 'hooks';
import { FORM } from 'consts';
import { Create } from '../create';
import { Use } from '../use';
import { Start } from '../start';

function Home() {
  const [form, setForm] = useState('create');

  const [programId, setProgramId] = useState('' as Hex);
  const uploadSupplyChain = useSupplyChainUpload(setProgramId);

  const openUseForm = () => setForm(FORM.USE);
  const openCreateForm = () => setForm(FORM.CREATE);
  const closeForm = () => setForm('');

  const getForm = () => {
    switch (form) {
      case FORM.CREATE:
        return <Create onCancel={closeForm} onSubmit={uploadSupplyChain} />;
      case FORM.USE:
        return <Use onCancel={closeForm} onSubmit={setProgramId} />;
      default:
        return <Start onCreate={openCreateForm} onUse={openUseForm} />;
    }
  };

  return getForm();
}

export { Home };
