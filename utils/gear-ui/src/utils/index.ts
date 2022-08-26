import { Gap } from '../types';

const getLabelGap = (gap: Gap) => {
  const [labelColumn, inputColumn] = gap.split('/');
  const gridTemplateColumns = `${labelColumn}fr ${inputColumn}fr`;

  return { gridTemplateColumns };
};

export { getLabelGap };
