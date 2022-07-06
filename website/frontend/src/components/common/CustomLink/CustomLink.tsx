import { Link, LinkProps } from 'react-router-dom';

import styles from './CustomLink.module.scss';

import { fileNameHandler } from 'helpers';

type Props = LinkProps & {
  text: string;
};

const CustomLink = ({ text, ...other }: Props) => (
  <Link {...other} className={styles.customLink}>
    {fileNameHandler(text)}
  </Link>
);

export { CustomLink };
