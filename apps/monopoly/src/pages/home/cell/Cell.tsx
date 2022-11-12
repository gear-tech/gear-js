/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FunctionComponent, SVGProps, useState } from 'react';
import { ReactComponent as GradeSVG } from 'assets/images/icons/grade.svg';
import { Hex } from '@gear-js/api';
import numeral from 'numeral';
import clsx from 'clsx';
import { CellValues, PlayerType, PlayerState, Properties } from 'types';
import { useOutsideClick } from 'hooks';
import styles from '../Home.module.scss';
import { Chip } from '../chip';

type Props = {
  index: number;
  players: (PlayerState & PlayerType)[];
  Image: FunctionComponent<SVGProps<SVGSVGElement>> | string;
  ownership: { [key: number]: Hex } | undefined;
  properties: Properties | undefined;
  card: CellValues | undefined;
  type: string;
};

function Cell({ index, players, ownership, properties, Image, card, type }: Props) {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setIsCardVisible(false));

  const getColor = (address: Hex) => players?.find((player) => player.address === address)?.color;
  const getGrade = (grade: 'Platinum' | 'Silver' | 'Gold') => {
    switch (grade) {
      case 'Gold':
        return (
          <>
            <GradeSVG />
            <GradeSVG />
            <GradeSVG />
          </>
        );
      case 'Silver':
        return (
          <>
            <GradeSVG />
            <GradeSVG />
          </>
        );
      case 'Platinum':
        return <GradeSVG />;
      default:
        return null;
    }
  };

  const chips = players
    .filter(({ position, lost }) => !lost && +position === index)
    .map(({ color }) => <Chip key={color} color={color} />);

  const isAnyChip = chips.length > 0;

  const propertyValue = properties?.[index]?.[1];
  const propertyValueNumber = propertyValue ? +propertyValue.replaceAll(',', '') : 0;
  const formattedPropNumber = numeral(propertyValueNumber).format('0.00a');

  const ownershipColor = ownership?.[index] ? getColor(ownership[index]) : undefined;

  return (
    <div
      ref={ref}
      onClick={() => setIsCardVisible((prevValue) => !prevValue)}
      className={clsx(styles.a, styles[`a${index}`], ownershipColor && styles[ownershipColor], styles[type])}>
      {typeof Image === 'string' ? (
        <img src={Image} alt="" className={styles.icon} />
      ) : (
        <Image className={styles.icon} />
      )}
      {isAnyChip && <div className={styles.chips}>{chips}</div>}
      {!!propertyValueNumber && <div className={styles.propertyValue}>{formattedPropNumber}</div>}
      {properties?.[index]?.[0]?.[0] && <div className={styles.grade}>{getGrade(properties?.[index]?.[0]?.[0])}</div>}

      {isCardVisible && card && (
        <div className={styles.card}>
          <header className={styles.header}>{card.heading}</header>
          <div className={styles.body}>
            <p>Increase efficiency to increase rent</p>
            <div>
              <p className={styles.infoRow}>
                Base rent
                <span className={styles.value}>{card.baseRent}</span>
              </p>
              <p className={styles.infoRow}>
                <GradeSVG />
                <span className={styles.value}>{card.bronze}</span>
              </p>
              <p className={styles.infoRow}>
                <span className={styles.gradeSVGs}>
                  <GradeSVG />
                  <GradeSVG />
                </span>

                <span className={styles.value}>{card.silver}</span>
              </p>
              <p className={styles.infoRow}>
                <span className={styles.gradeSVGs}>
                  <GradeSVG />
                  <GradeSVG />
                  <GradeSVG />
                </span>
                <span className={styles.value}>{card.gold}</span>
              </p>
            </div>
            <div>
              <p className={styles.infoRow}>
                Field value
                <span className={styles.value}>{card.cell}</span>
              </p>
              <p className={styles.infoRow}>
                Deposit value
                <span className={styles.value}>{card.deposit}</span>
              </p>
              <p className={styles.infoRow}>
                Buyout
                <span className={styles.value}>{card.buyout}</span>
              </p>
              <p className={styles.infoRow}>
                Branch buyout
                <span className={styles.value}>{card.branch}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Cell };
