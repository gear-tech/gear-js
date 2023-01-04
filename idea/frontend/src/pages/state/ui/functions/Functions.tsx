import { IState } from 'pages/state/model';

import { Box } from 'shared/ui/box';

import { ExpansionPanel } from '../expansionPanel';
import styles from './Functions.module.scss';

type Props = {
  list: IState[] | undefined;
  value: string;
  onChange: (value: string) => void;
};

const Functions = ({ list, value, onChange }: Props) => {
  const getFunctions = () =>
    list?.map(({ name, id, functions }) => (
      <li key={id}>
        <ExpansionPanel heading={name} list={Object.keys(functions)} value={value} onChange={onChange} />
      </li>
    ));

  return (
    <Box>
      <h3 className={styles.heading}>Functions</h3>
      <ul className={styles.functions}>{getFunctions()}</ul>
    </Box>
  );
};

export { Functions };
