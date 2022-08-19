import { ReactComponent as Twitter } from 'assets/images/socials/twitter.svg';
import { ReactComponent as Github } from 'assets/images/socials/github.svg';
import { ReactComponent as Discord } from 'assets/images/socials/discord.svg';
import { ReactComponent as Medium } from 'assets/images/socials/medium.svg';

import styles from './Socials.module.scss';

const socials = [
  { href: 'https://twitter.com/gear_techs', icon: Twitter },
  { href: 'https://github.com/gear-tech', icon: Github },
  { href: 'https://discord.com/invite/7BQznC9uD9', icon: Discord },
  { href: 'https://medium.com/@gear_techs', icon: Medium },
];

function Socials() {
  const getItems = () =>
    socials.map(({ href, icon: Icon }) => (
      <li key={href}>
        <a href={href} target="_blank" rel="noreferrer">
          <Icon />
        </a>
      </li>
    ));

  return <ul className={styles.socials}>{getItems()}</ul>;
}

export { Socials };
