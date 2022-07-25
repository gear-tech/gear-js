import clsx from 'clsx';
import { AnyJson } from '@polkadot/types/types';
import { getPreformattedText } from 'helpers';
import commonStyles from '../ExpansionPanel/ExpansionPanel.module.scss';
import styles from './Pre.module.scss';

type Props = {
  text: AnyJson;
};

const Pre = ({ text }: Props) => {
  const className = clsx(commonStyles.text, styles.pre);
  return <pre className={className}>{getPreformattedText(text)}</pre>;
};

export { Pre };
