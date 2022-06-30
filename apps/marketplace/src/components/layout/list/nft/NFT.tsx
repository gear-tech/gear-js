import { Button } from '@gear-js/ui';
import { Link } from 'react-router-dom';
import styles from './NFT.module.scss';

type Props = {
  path: string;
  src: string;
  name: string;
  text: string;
  priceHeading: string;
  priceText: string;
  buttonText?: string;
};

function NFT({ path, src, name, text, priceHeading, priceText, buttonText }: Props) {
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
              <h3 className={styles.heading}>{priceHeading}</h3>
              <p className={styles.text}>{priceText}</p>
            </div>
          </div>
        </div>
        {buttonText && <Button text={buttonText} block />}
      </Link>
    </li>
  );
}

export { NFT };
