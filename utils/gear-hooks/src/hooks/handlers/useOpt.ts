import { useState, useEffect } from 'react';

function useOpt(source: string) {
  const [buffer, setBuffer] = useState<Buffer>();

  useEffect(() => {
    fetch(source)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => setBuffer(Buffer.from(arrayBuffer)));
  }, [source]);

  return buffer;
}

export { useOpt };
