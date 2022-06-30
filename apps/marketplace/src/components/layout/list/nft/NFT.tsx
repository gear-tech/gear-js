import { Button, ButtonProps } from '@gear-js/ui';
import { Link } from 'react-router-dom';
import styles from './NFT.module.scss';

type Props = {
  path: string;
  src: string;
  name: string;
  text: string;
  price: { heading: string; text: string };
  button?: { text: string; color: ButtonProps['color'] };
};

function NFT({ path, src, name, text, price, button }: Props) {
  return (
    <li>
      <Link to={path} className={styles.nft}>
        <img src={src} alt="" className={styles.image} />
        <div>
          <div className={styles.body}>
            <div>
              <h3 className={styles.heading}>{name}</h3>
              <p className={styles.text}>{text}</p>
            </div>
            <div className={styles.value}>
              <h3 className={styles.heading}>{price.heading}</h3>
              <p className={styles.text}>{price.text}</p>
            </div>
          </div>
        </div>
        {button && <Button text={button.text} color={button.color} block />}
      </Link>
    </li>
  );
}

export { NFT };
