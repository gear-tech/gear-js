import { Link, LinkProps } from 'react-router-dom';

import { getShortName } from '@/shared/helpers';

import styles from './CustomLink.module.scss';

type Props = LinkProps & {
  text: string;
};

const CustomLink = ({ text, ...other }: Props) => (
  <Link {...other} className={styles.customLink}>
    {getShortName(text)}
  </Link>
);

export { CustomLink };
