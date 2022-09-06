import { useEffect, useState } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { NodeSection } from 'entities/node';
import { DEFAULT_NODES_URL } from 'shared/config';

const useNodes = () => {
  const alert = useAlert();

  const [nodeSections, setNodeSections] = useState<NodeSection[]>([]);

  useEffect(() => {
    fetch(DEFAULT_NODES_URL)
      .then((result) => result.json())
      .then(setNodeSections)
      .catch((error) => alert.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return nodeSections;
};

export { useNodes };
