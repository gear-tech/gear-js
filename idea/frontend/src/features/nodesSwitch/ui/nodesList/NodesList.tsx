import { useEffect } from 'react';
import SimpleBar from 'simplebar-react';

import { NodeSection } from 'entities/node';

import styles from './NodesList.module.scss';
import { Section } from '../section';

type Props = {
  nodeAddress: string;
  nodeSections: NodeSection[];
  selectedNode: string;
  selectNode: (address: string) => void;
  removeLocalNode: (address: string) => void;
};

const NodesList = (props: Props) => {
  const { nodeAddress, nodeSections, selectedNode, selectNode, removeLocalNode } = props;

  useEffect(() => {
    document.getElementById(selectedNode)?.scrollIntoView(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SimpleBar className={styles.simpleBar}>
      <ul className={styles.list}>
        {nodeSections.map((section, index) => (
          <Section
            // eslint-disable-next-line react/no-array-index-key
            key={`${section.caption}-${index}`}
            section={section}
            nodeAddress={nodeAddress}
            selectedNode={selectedNode}
            selectNode={selectNode}
            removeLocalNode={removeLocalNode}
          />
        ))}
      </ul>
    </SimpleBar>
  );
};

export { NodesList };
