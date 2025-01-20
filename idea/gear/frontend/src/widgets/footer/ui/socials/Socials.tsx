import styles from './Socials.module.scss';
import { SOCIALS } from '../../model/consts';
import { SocialItem } from '../socialItem/SocialItem';

const Socials = () => {
  const getLinks = () => SOCIALS.map(({ name, href }) => <SocialItem key={href} name={name} href={href} />);

  return <ul className={styles.socials}>{getLinks()}</ul>;
};

export { Socials };
