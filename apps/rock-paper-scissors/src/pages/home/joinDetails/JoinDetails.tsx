import { BackButton, Detail } from 'components';
import { Button } from '@gear-js/ui';
import { SVGType } from 'types';
import { Hex } from '@gear-js/api';

import styles from './JoinDetails.module.scss'

type Props = {
    onBackClick: (arg: string) => void;
    onClickRegister?: (arg: any) => void;
    clearProgrammId: (arg: Hex) => void;
    heading: string;
    bet: string | undefined;
    game: string;
    round: string;
    players: string;
    SVG: SVGType;
    entry: string | undefined;
    move: string | undefined;
    reveal: string | undefined;
    contract: Hex | undefined;
    hoursLeft: string;
    minutesLeft: string;
    secondsLeft: string;
};

function JoinDetails({ onBackClick,
    onClickRegister,
    clearProgrammId,
    hoursLeft,
    minutesLeft,
    secondsLeft,
    round,
    game,
    heading,
    bet,
    players,
    entry,
    move,
    reveal,
    SVG,
    contract
}: Props) {
    const timeLeftToString = `Register ${hoursLeft}:${minutesLeft}:${secondsLeft}`
    return (
        <div className={styles.container}>
            <div className={styles.visual}>
                <BackButton onClick={() => { onBackClick('join'); clearProgrammId('' as Hex) }} />
                <SVG className={styles.svg} />
            </div>
            <div>
                <h2 className={styles.heading}>{heading}</h2>
                <div className={styles.details}>
                    <Detail label="Current game" text={game} className={styles.game} />
                    <Detail label="Current round" text={round} className={styles.round} />
                    <Detail label="Contract address" className={styles.contract}>
                        <span className={styles.contractText}>{contract}</span>
                    </Detail>
                    <Detail label="Players" text={players} className={styles.players} />
                    <Detail label="Bet size" className={styles.bet}>
                        <span className={styles.betText}>{bet}</span>
                    </Detail>
                    {entry && <Detail label="Entry timeout" text={entry} className={styles.entry} />}
                    {move && <Detail label="Move timeout" text={move} className={styles.move} />}
                    {reveal && <Detail label="Reveal timeout" text={reveal} className={styles.reveal} />}
                    <Button
                        className={styles.register}
                        text={timeLeftToString}
                        block
                        onClick={onClickRegister}
                    />
                </div>
            </div>
        </div>
    )
};

export { JoinDetails }