import { Gap } from '../types';

const getLabelGap = (gap: Gap) => {
  const [labelColumn, inputColumn] = gap.split('/');
  const gridTemplateColumns = `${labelColumn}fr ${inputColumn}fr`;

  return { gridTemplateColumns };
};

const getFileSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const unitIndex = bytes ? Math.floor(Math.log(bytes) / Math.log(1024)) : 0;

  const size = bytes ? (bytes / 1024 ** unitIndex).toFixed(2) : '0';
  const unit = units[unitIndex];

  return `${size} ${unit}`;
};

export { getLabelGap, getFileSize };
