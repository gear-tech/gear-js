import { useAlert } from '@gear-js/react-hooks';
import { Button, Radio } from '@gear-js/ui';

import { copyToClipboard } from 'shared/helpers';
import trashSVG from 'shared/assets/images/actions/trash.svg';
import copyGreenSVG from 'shared/assets/images/actions/copyGreen.svg';

import styles from './Node.module.scss';

type Props = {
  address: string;
  isCustom: boolean;
  nodeAddress: string;
  selectedNode: string;
  selectNode: (address: string) => void;
  removeLocalNode: (address: string) => void;
};

const Node = ({ address, isCustom, nodeAddress, selectedNode, selectNode, removeLocalNode }: Props) => {
  const alert = useAlert();

  const handleCopy = () => copyToClipboard(address, alert, 'Node address copied');

  const handleChange = () => selectNode(address);

  const handleRemove = () => removeLocalNode(address);

  const isCurrentNode = nodeAddress === address;

  return (
    <li id={address} className={styles.node}>
      <Radio
        name="node"
        label={address}
        className={styles.radio}
        checked={selectedNode === address}
        onChange={handleChange}
      />
      <div className={styles.buttons}>
        <Button
          icon={copyGreenSVG}
          color="transparent"
          className={styles.actionBtn}
          aria-label="Copy node address"
          onClick={handleCopy}
        />
        {isCustom && (
          <Button
            icon={trashSVG}
            color="transparent"
            disabled={isCurrentNode}
            className={styles.actionBtn}
            aria-label="Remove node address"
            onClick={handleRemove}
          />
        )}
      </div>
    </li>
  );
};

export { Node };
