import { useAlert } from '@gear-js/react-hooks';
import { Button, radioStyles } from '@gear-js/ui';
import clsx from 'clsx';

import { Node as NodeType } from 'entities/node';
import { copyToClipboard } from 'shared/helpers';
import { ReactComponent as trashSVG } from 'shared/assets/images/actions/trash.svg';
import { ReactComponent as copyGreenSVG } from 'shared/assets/images/actions/copyGreen.svg';
import { ICON } from 'widgets/menu/model/consts';

import styles from './Node.module.scss';

type Props = NodeType & {
  nodeAddress: string;
  selectedNode: string;
  selectNode: (address: string) => void;
  removeLocalNode: (address: string) => void;
};

const Node = (props: Props) => {
  const { address, isCustom, nodeAddress, selectedNode, selectNode, removeLocalNode, icon = 'gear' } = props;

  const SVG = ICON[icon as keyof typeof ICON].NETWORK;

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
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className={clsx(radioStyles.label, styles.radio, isCurrentNode && styles.current)}>
        <input
          type="radio"
          name="node"
          checked={selectedNode === address}
          onChange={handleChange}
          className={radioStyles.input}
        />

        <SVG className={styles.icon} />

        {address}
      </label>

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
