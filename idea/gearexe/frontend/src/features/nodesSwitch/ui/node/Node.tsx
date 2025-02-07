import { Node as NodeType } from '../../types';
import { CopyButton } from '@/components';

import styles from './Node.module.scss';

type Props = NodeType & {
  selectedNode: string;
  selectNode: (address: string) => void;
};

const Node = (props: Props) => {
  const { address, selectedNode, selectNode } = props;

  const handleChange = () => selectNode(address);

  return (
    <li id={address} className={styles.node}>
      <label className={styles.radio}>
        <input
          type="radio"
          name="node"
          checked={selectedNode === address}
          onChange={handleChange}
          className={styles.input}
        />

        <span>{address}</span>
      </label>

      <div className={styles.buttons}>
        <CopyButton value={address} className={styles.actionBtn} aria-label="Copy node address" />
      </div>
    </li>
  );
};

export { Node };
