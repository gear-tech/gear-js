import { IState } from 'pages/state/model';

import { Box } from 'shared/ui/box';

import { ExpansionPanel } from '../expansionPanel';
import styles from './Functions.module.scss';

type Props = {
  list: IState[] | undefined;
  value: string;
  onFunctionChange: (value: string) => void;
  onStateChange: (value: IState) => void;
};

const Functions = ({ list, value, onFunctionChange, onStateChange }: Props) => {
  const getFunctions = () =>
    list?.map((state) => {
      const { name, id, functions } = state;

      const handleFunctionChange = (funcValue: string) => {
        onFunctionChange(funcValue);
        onStateChange(state);
      };

      return (
        <li key={id}>
          <ExpansionPanel heading={name} list={Object.keys(functions)} value={value} onChange={handleFunctionChange} />
        </li>
      );
    });

  return (
    <Box>
      <h3 className={styles.heading}>Functions</h3>
      <ul className={styles.functions}>{getFunctions()}</ul>
    </Box>
  );
};

export { Functions };
