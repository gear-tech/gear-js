import { ReactComponent as LizardSVG } from 'assets/images/backgrounds/lizard.svg';
import { ReactComponent as PaperSVG } from 'assets/images/actions/paper.svg';
import { Hex } from '@gear-js/api';
import { Start } from './start';
import { Create } from './create';
import { Game } from './game';
import { Details } from './details';
import { RoundResult } from './round-result';
import { GameResult } from './game-result';
import { Move } from './move';
import { Reveal } from './reveal';

const players = ['0x00', '0x00', '0x00', '0x00'] as Hex[];

function Home() {
  return (
    <>
      <Reveal move={{ name: 'Paper', SVG: PaperSVG }} />
      {/* <Move value="Paper" /> */}
      {/* <RoundResult name="name" game="2" round="3" winners={players} loosers={players} /> */}
      {/* <GameResult name="name" game="2" winner="0x00" loosers={players} /> */}
      {/* <Details
        heading="name"
        bet="bet"
        game="game"
        round="round"
        contract="0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
        players="10"
        entry="10"
        move="05"
        reveal="10"
        SVG={LizardSVG}
      /> */}
      {/* <Game heading="name" stage="progress" bet="bet" game="game" round="round" /> */}
      {/* <Start /> */}
      {/* <Create /> */}
    </>
  );
}

export { Home };
