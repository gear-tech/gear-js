import { useCreateHandler } from '@gear-js/react-hooks';
import { useWasm } from 'hooks';
import { useState } from 'react';
import { Create } from './create';
import { Start } from './start';

function useForm() {
  const [form, setForm] = useState('create');

  const openCreateForm = () => setForm('create');
  const closeForm = () => setForm('');

  return { form, openCreateForm, closeForm };
}

function useCreateRockPaperScissors() {
  const { codeHash, meta } = useWasm();
  return useCreateHandler(codeHash, meta);
}

function Home() {
  const { form, openCreateForm, closeForm } = useForm();
  const create = useCreateRockPaperScissors();

  return form ? (
    <Create onBackClick={closeForm} onSubmit={create} />
  ) : (
    <Start games={[]} ownerGames={[]} onCreateClick={openCreateForm} />
  );
}

export { Home };
