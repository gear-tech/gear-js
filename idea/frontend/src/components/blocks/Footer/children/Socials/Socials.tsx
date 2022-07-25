import { SOCIALS } from './const';
import { Link } from './Link/Link';
import styles from './Socials.module.scss';

const Socials = () => {
  // eslint-disable-next-line react/no-array-index-key
  const getLinks = () => SOCIALS.map((link, index) => <Link key={index} name={link.name} href={link.href} />);

  return <ul className={styles.socials}>{getLinks()}</ul>;
};

export { Socials };
