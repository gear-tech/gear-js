import { useForm } from '@mantine/form';
import { Input } from '@gear-js/ui';

import { Placeholder } from 'entities/placeholder';
import { IState } from 'pages/state/model';
import { Box } from 'shared/ui/box';
import { ReactComponent as FunctionPlaceholderSVG } from 'shared/assets/images/placeholders/stateFunctionPlaceholder.svg';

import { ExpansionPanel } from '../expansionPanel';
import styles from './Functions.module.scss';

type Props = {
  list: IState[];
  value: string;
  isReady: boolean;
  onFunctionChange: (value: string) => void;
  onStateChange: (value: IState) => void;
  onSearchSubmit: (value: string) => void;
};

const initialValues = { query: '' };

const Functions = ({ list, value, isReady, onFunctionChange, onStateChange, onSearchSubmit }: Props) => {
  const { getInputProps, onSubmit } = useForm({ initialValues });

  const isAnyFunction = isReady && list.length > 0;
  const isListEmpty = isReady && list.length === 0;

  const getFunctions = () =>
    list?.map((state) => {
      const { name, id, functions } = state;
      const functionNames = Object.keys(functions);

      const handleFunctionChange = (funcValue: string) => {
        onFunctionChange(funcValue);
        onStateChange(state);
      };

      return (
        <li key={id}>
          <ExpansionPanel heading={name} list={functionNames} value={value} onChange={handleFunctionChange} />
        </li>
      );
    });

  const handleSearchSubmit = onSubmit(({ query }) => onSearchSubmit(query));

  return (
    <>
      <form className={styles.form} onSubmit={handleSearchSubmit}>
        <Input type="search" placeholder="Search by function name" {...getInputProps('query')} />
      </form>
      <Box>
        <h3 className={styles.heading}>Functions</h3>
        {isAnyFunction ? (
          <ul className={styles.functions}>{getFunctions()}</ul>
        ) : (
          <div className={styles.placeholder}>
            <Placeholder
              block={<FunctionPlaceholderSVG />}
              title="There are no functions yet"
              description="The list is empty while there are no functions"
              isEmpty={isListEmpty}
              blocksCount={9}
            />
          </div>
        )}
      </Box>
    </>
  );
};

export { Functions };
