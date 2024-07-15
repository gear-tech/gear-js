import { Sails } from 'sails-js';

import styles from './sails-preview.module.scss';

type Props = {
  value: Sails;
};

function SailsPreview({ value }: Props) {
  const types = value.scaleCodecTypes;

  return null;
}

export { SailsPreview };
