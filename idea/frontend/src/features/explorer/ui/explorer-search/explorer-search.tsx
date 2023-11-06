import { Input } from '@gear-js/ui';
import { isHex } from '@polkadot/util';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { isNumeric } from '../../utils';

const defaultValues = { searchQuery: '' };
const validate = (value: string) => (isNumeric(value) || isHex(value) ? true : 'Value should be number or hex');

const ExplorerSearch = () => {
  const form = useForm({ defaultValues });
  const { register, reset, getFieldState, formState } = form;
  const { error } = getFieldState('searchQuery', formState);

  const navigate = useNavigate();

  const handleSubmit = ({ searchQuery }: typeof defaultValues) => {
    const path = `/explorer/${searchQuery}`;

    navigate(path);
    reset();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Input
        type="search"
        placeholder="Search block hash or number to query"
        error={error?.message}
        {...register('searchQuery', { validate })}
      />
    </form>
  );
};

export { ExplorerSearch };
