import { useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

function useRootPortal(id: string, element: ReactNode) {
  const [root, setRoot] = useState<HTMLElement>();

  useEffect(() => {
    const existingRoot = document.getElementById(id);

    if (existingRoot) return setRoot(existingRoot);

    const newRoot = document.createElement('div');
    newRoot.id = id;
    document.body.appendChild(newRoot);

    setRoot(newRoot);

    return () => {
      if (!newRoot) return;

      document.body.removeChild(newRoot);
    };
  }, [id]);

  return root ? createPortal(element, root) : null;
}

export { useRootPortal };
