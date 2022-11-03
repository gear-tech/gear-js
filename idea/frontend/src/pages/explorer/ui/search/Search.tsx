import { Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isHex } from '@polkadot/util';
import { useNavigate } from 'react-router-dom';

import { isNumeric } from '../../helpers';

const initialValues = { searchQuery: '' };
const validate = {
  searchQuery: (value: string) => (isNumeric(value) || isHex(value) ? null : 'Value should be number or hex'),
};

const Search = () => {
  const { getInputProps, onSubmit, reset } = useForm({ initialValues, validate });
  const navigate = useNavigate();

  const handleSubmit = onSubmit(({ searchQuery }) => {
    const path = `/explorer/${searchQuery}`;

    navigate(path);
    reset();
  });

  return (
    <form onSubmit={handleSubmit}>
      <Input type="search" placeholder="Search block hash or number to query" {...getInputProps('searchQuery')} />
    </form>
  );
};

export { Search };
