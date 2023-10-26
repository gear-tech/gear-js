import { useAlert } from '@gear-js/react-hooks';
import { Button, radioStyles } from '@gear-js/ui';
import clsx from 'clsx';

import { Node as NodeType } from '@/entities/node';
import { copyToClipboard } from '@/shared/helpers';
import CopyGreenSVG from '@/shared/assets/images/actions/copyGreen.svg?react';
import { ICON } from '@/widgets/menu/model/consts';

import TrashSVG from '../../assets/trash.svg?react';
import styles from './Node.module.scss';

type Props = NodeType & {
  nodeAddress: string | undefined;
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
        <span>{address}</span>
      </label>

      <div className={styles.buttons}>
        {isCustom && (
          <Button
            icon={TrashSVG}
            color="transparent"
            disabled={isCurrentNode}
            className={styles.actionBtn}
            aria-label="Remove node address"
            onClick={handleRemove}
          />
        )}

        <Button
          icon={CopyGreenSVG}
          color="transparent"
          className={styles.actionBtn}
          aria-label="Copy node address"
          onClick={handleCopy}
        />
      </div>
    </li>
  );
};

export { Node };
