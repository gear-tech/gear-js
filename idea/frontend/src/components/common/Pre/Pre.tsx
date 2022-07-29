import clsx from 'clsx';
import { AnyJson } from '@polkadot/types/types';
import { getPreformattedText } from 'helpers';

import styles from './Pre.module.scss';

type Props = {
  text: AnyJson;
};

const Pre = ({ text }: Props) => <pre className={clsx(styles.text, styles.pre)}>{getPreformattedText(text)}</pre>;

export { Pre };
