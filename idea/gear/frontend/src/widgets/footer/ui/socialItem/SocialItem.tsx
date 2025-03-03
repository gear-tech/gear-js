import styles from './SocialItem.module.scss';

type Props = {
  name: string;
  href: string;
};

const SocialItem = ({ name, href }: Props) => (
  <li className={styles.link}>
    {}
    <a href={href} target="_blank" rel="noreferrer" className={styles[name]} aria-label={name} />
  </li>
);

export { SocialItem };
