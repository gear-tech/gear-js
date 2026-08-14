import type { AnyJson } from '@polkadot/types/types';

import { getPreformattedText } from '@/shared/helpers';

const downloadJson = (state: AnyJson) => {
  const json = getPreformattedText(state, 2);
  const blob = new Blob([json], { type: 'application/json' });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('style', 'display: none');
  link.setAttribute('href', url);
  link.setAttribute('download', 'state');

  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

export { downloadJson };
