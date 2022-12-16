import { useAlert } from '@gear-js/react-hooks';
import { Button, Radio } from '@gear-js/ui';

import { copyToClipboard } from 'shared/helpers';
import { ReactComponent as trashSVG } from 'shared/assets/images/actions/trash.svg';
import { ReactComponent as copyGreenSVG } from 'shared/assets/images/actions/copyGreen.svg';

import clsx from 'clsx';
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

  const isCurrentNode = nodeAddress === address;

  const handleCopy = () => copyToClipboard(address, alert, 'Node address copied');

  const handleChange = () => selectNode(address);

  const handleRemove = () => {
    if (isCurrentNode) return;

    removeLocalNode(address);
  };

  return (
    <li id={address} className={styles.node}>
      <Radio
        name="node"
        label={address}
        className={clsx(styles.radio, isCurrentNode && styles.current)}
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
